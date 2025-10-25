import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Base_Url_Server from '../../Constants/baseUrl';
import styles from './index.module.scss';
import { checkPdfAccess, downloadPdf } from '../../Services/pdfService';
import { initiateCheckout } from '../../Services/paymentService';
import CircularProgress from '@mui/material/CircularProgress';

const PDFDetailPage = () => {
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return 'Tarix yoxdur';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Tarix yoxdur';
      
      // gün.ay.il formatında (dd.mm.yyyy)
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}.${month}.${year}`;
    } catch (error) {
      console.error('Date formatlaşdırması xətası:', error);
      return 'Tarix yoxdur';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // File URL formatlaşdırması üçün helper funksiya
  const formatFileUrl = (filePath) => {
    if (!filePath) return '';
    
    // Server path-i web URL-ə çevir
    const webPath = filePath.replace('/home/muhasibatjurnal/backend-mmu', '');
    return `https://api.muhasibatjurnal.az${webPath}`;
  };

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        setLoading(true);
        console.log('Fetching PDF with ID:', id);
        const response = await axios.get(Base_Url_Server + `pdfs/${id}`);
        console.log('PDF API response:', response.data);
        
        // API response structure: {status: "success", data: {pdf: {...}}}
        const pdfData = response.data?.data?.pdf;
        console.log('Parsed PDF data:', pdfData);
        
        if (pdfData) {
          setPdf(pdfData);
        } else {
          setError('PDF məlumatları tapılmadı');
        }
      } catch (error) {
        console.error('PDF yüklenirkən xəta:', error);
        if (error.response) {
          setError(`API xətası: ${error.response.status} - ${error.response.data?.message || error.message}`);
        } else {
          setError('Şəbəkə xətası: ' + error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPdf();
    } else {
      setError('PDF ID-si tapılmadı');
      setLoading(false);
    }
  }, [id]);

  // PDF erişim kontrolü
  useEffect(() => {
    const checkAccess = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setHasAccess(false);
        setCheckingAccess(false);
        return;
      }

      try {
        setCheckingAccess(true);
        const response = await checkPdfAccess(id, token);
        setHasAccess(response?.data?.hasAccess || false);
      } catch (error) {
        console.error('Erişim kontrolü xətası:', error);
        setHasAccess(false);
      } finally {
        setCheckingAccess(false);
      }
    };

    if (id) {
      checkAccess();
    }
  }, [id]);

  const handleDownload = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (!hasAccess) {
      alert('Bu PDF-ə giriş icazəniz yoxdur. Zəhmət olmasa satın alın.');
      return;
    }

    try {
      setDownloadLoading(true);
      const blob = await downloadPdf(id, token);
      
      // Blob'dan dosya oluştur ve indir
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = pdf?.title ? `${pdf.title}.pdf` : 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Yükləmə xətası:', error);
      alert('PDF yükləmə xətası. Zəhmət olmasa yenidən cəhd edin.');
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleView = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (!hasAccess) {
      alert('Bu PDF-ə giriş icazəniz yoxdur. Zəhmət olmasa satın alın.');
      return;
    }

    if (pdf && pdf.file_path) {
      window.open(formatFileUrl(pdf.file_path), '_blank');
    }
  };

  // Tek PDF satın alma
  const handleBuyPdf = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setCheckoutLoading(true);
      const data = {
        type: 'single-pdf',
        pdfId: id,
        amount: pdf?.price || 0
      };
      
      const response = await initiateCheckout(data, token);
      
      if (response?.data?.payment?.paymentUrl) {
        window.location.href = response.data.payment.paymentUrl;
      } else {
        throw new Error('Ödəniş URL-i alınmadı');
      }
    } catch (error) {
      console.error('Ödəniş xətası:', error);
      alert('Ödəniş zamanı xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
      setCheckoutLoading(false);
    }
  };

  // Abonelik satın alma
  const handleSubscribe = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setCheckoutLoading(true);
      const data = {
        type: 'subscription',
        plan: '1m'
      };
      
      const response = await initiateCheckout(data, token);
      
      if (response?.data?.payment?.paymentUrl) {
        window.location.href = response.data.payment.paymentUrl;
      } else {
        throw new Error('Ödəniş URL-i alınmadı');
      }
    } catch (error) {
      console.error('Ödəniş xətası:', error);
      alert('Ödəniş zamanı xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
      setCheckoutLoading(false);
    }
  };

  if (loading || checkingAccess) {
    return (
      <div className={styles.pdfDetailPage}>
        <div className={styles.loading}>
          <CircularProgress />
          <p>Yüklənir...</p>
        </div>
      </div>
    );
  }

  if (error || !pdf) {
    return (
      <div className={styles.pdfDetailPage}>
        <div className={styles.error}>
          <h2>Xəta</h2>
          <p>{error || 'PDF tapılmadı'}</p>
          <button 
            className={styles.backBtn}
            onClick={() => navigate('/kitabxana')}
          >
            Kitabxanaya qayıt
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pdfDetailPage}>
      <div className={styles.hero}>
        <div className={styles.heroImage}>
          <img 
            src={pdf.image_path ? `${Base_Url_Server.replace('/api/', '')}${pdf.image_path}` : '/src/Assets/heroImage.jpg'} 
            alt={pdf.title}
            onError={(e) => {
              e.target.src = '/src/Assets/heroImage.jpg'; // Fallback image
            }}
          />
        </div>
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <div className={styles.breadcrumb}>
              <span 
                className={styles.breadcrumbLink}
                onClick={() => navigate('/')}
              >
                Ana səhifə
              </span>
              <span className={styles.breadcrumbSeparator}>/</span>
              <span 
                className={styles.breadcrumbLink}
                onClick={() => navigate('/kitabxana')}
              >
                Kitabxana
              </span>
              <span className={styles.breadcrumbSeparator}>/</span>
              <span className={styles.breadcrumbCurrent}>PDF</span>
            </div>
            <h1>{pdf.title}</h1>
            <div className={styles.heroMeta}>
              {pdf.language && (
                <span className={styles.language}>{pdf.language}</span>
              )}
              {pdf.category?.name && (
                <span className={styles.category}>{pdf.category.name}</span>
              )}
              <span className={styles.date}>
                {formatDate(pdf.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.pdfContent}>
            {pdf.description && (
              <div className={styles.description}>
                <h3>Təsvir</h3>
                <p>{pdf.description}</p>
              </div>
            )}
            
            <div className={styles.pdfActions}>
              {checkoutLoading && (
                <div className={styles.checkoutLoading}>
                  <CircularProgress size={30} />
                  <p>Ödəniş səhifəsinə yönləndirilirsiniz...</p>
                </div>
              )}
              
              {hasAccess ? (
                <>
                  <button 
                    className={styles.viewButton}
                    onClick={handleView}
                    disabled={checkoutLoading}
                  >
                    PDF-i Bax
                  </button>
                  <button 
                    className={styles.downloadButton}
                    onClick={handleDownload}
                    disabled={downloadLoading || checkoutLoading}
                  >
                    {downloadLoading ? 'Yüklənir...' : 'Yüklə'}
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className={styles.buyButton}
                    onClick={handleBuyPdf}
                    disabled={checkoutLoading}
                  >
                    Al (Qiymət: {pdf?.price || 0} AZN)
                  </button>
                  <button 
                    className={styles.subscribeButton}
                    onClick={handleSubscribe}
                    disabled={checkoutLoading}
                  >
                    Abunə Ol
                  </button>
                  <p className={styles.accessNote}>
                    Bu PDF-ə giriş üçün satın almalı və ya abunə olmalısınız.
                  </p>
                </>
              )}
            </div>
          </div>

          <div className={styles.sidebar}>
            <div className={styles.pdfInfo}>
              <h3>PDF Məlumatları</h3>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Başlıq:</span>
                <span className={styles.infoValue}>{pdf.title}</span>
              </div>
              {pdf.category?.name && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Kateqoriya:</span>
                  <span className={styles.infoValue}>{pdf.category.name}</span>
                </div>
              )}
              {pdf.language && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Dil:</span>
                  <span className={styles.infoValue}>{pdf.language}</span>
                </div>
              )}
              {pdf.file_size && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Fayl ölçüsü:</span>
                  <span className={styles.infoValue}>{formatFileSize(pdf.file_size)}</span>
                </div>
              )}
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Tarix:</span>
                <span className={styles.infoValue}>{formatDate(pdf.created_at)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Yüklənmə sayı:</span>
                <span className={styles.infoValue}>{pdf.downloads || 0}</span>
              </div>
            </div>

            <div className={styles.actions}>
              <button 
                className={styles.backButton}
                onClick={() => navigate('/kitabxana')}
              >
                Kitabxanaya qayıt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFDetailPage;