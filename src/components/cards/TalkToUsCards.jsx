import React, { useEffect } from 'react';
import styles from './TalkToUsCards.module.css';

export default function ContactCards() {
  useEffect(() => {
    // Dynamically inject Typekit and Webflow/GSAP initialization scripts safely
    const loadScript = (src, id, async = true, type = 'text/javascript') => {
      if (document.getElementById(id)) return;
      const script = document.createElement('script');
      script.src = src;
      script.id = id;
      script.async = async;
      script.type = type;
      document.body.appendChild(script);
    };

    // Load Typekit header script programmatically if needed
    try {
      if (window.Typekit) {
        window.Typekit.load();
      }
    } catch (e) {}

    // Safely load required external scripts via useEffect
    loadScript('https://use.typekit.net/efo4rwu.js', 'typekit-script');
    loadScript('https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js', 'jquery-script');
    loadScript('https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/js/webflow.schunk.36b8fb49256177c8.js', 'webflow-chunk');
    loadScript('https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/js/webflow.ac7f03dd.fa0c24877a103955.js', 'webflow-main');
    loadScript('https://cdn.prod.website-files.com/gsap/3.15.0/gsap.min.js', 'gsap-script');
    loadScript('https://cdn.prod.website-files.com/gsap/3.15.0/ScrollTrigger.min.js', 'scrolltrigger-script');

    // Clean up if component unmounts to prevent memory leaks
    return () => {
      // Optional cleanup logic if scripts need unmounting
    };
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.mainWrapper}>
        <div className={styles.pageContentWrapper}>
          <section 
            data-wf-contact-cards-website-variant="personal" 
            className={`${styles.sectionContactCards} ${styles.section}`}
          >
            <div className={styles.paddingGlobal}>
              <div className={`${styles.wLayoutBlockcontainer} ${styles.containerMedium} ${styles.wContainer}`}>
                <div className={styles.contactCardsInner}>
                  
                  {/* Card 1: Talk to us */}
                  <div className={`${styles.contactCardItem} ${styles.relative}`}>
                    <div className={`${styles.backgroundColorAgreen} ${styles.absolute} ${styles.zIndex1}`}></div>
                    <div className={`${styles.absolute} ${styles.zIndex1}`}>
                      <img 
                        sizes="100vw" 
                        srcSet="https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69e0bf97f8396022efe2336e_Talk%20to%20us_Contact%20Card-p-500.webp 500w, https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69e0bf97f8396022efe2336e_Talk%20to%20us_Contact%20Card.webp 619w" 
                        alt="a man pointing up with his finger" 
                        src="https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69e0bf97f8396022efe2336e_Talk%20to%20us_Contact%20Card.webp" 
                        loading="lazy" 
                        className={`${styles.imgContain} ${styles.alignRightBtm}`} 
                      />
                    </div>
                    <div className={`${styles.contactCardContent} ${styles.zIndex2}`}>
                      <div className={`${styles.contactCardHeader} ${styles.textColorDarkestGreen}`}>
                        <img 
                          alt="FAQ icon" 
                          src="https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69ce34c601aebebcd981dcf0_whatsapp-24.svg" 
                          className={styles.iconHeightMedium} 
                        />
                        <h3 className={styles.headingStyleH3}>Talk to us</h3>
                      </div>
                      <div className={styles.buttonWrapper}>
                        <a 
                          href="https://api.whatsapp.com/send/?phone=%2B0917976765292&text&type=phone_number&app_absent=0" 
                          target="_blank" 
                          rel="noreferrer"
                          className={`${styles.button} ${styles.isReversed} ${styles.isMedium} ${styles.isIconLeft} ${styles.wInlineBlock}`}
                        >
                          <img 
                            loading="lazy" 
                            src="https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69ce34b464f8deba98e346fd_Help%20alt.svg" 
                            alt="Decorative" 
                            className={styles.icon1x1Medium} 
                          />
                          <div className={styles.textWeightBold}>Chat to support</div>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Call us */}
                  <div className={`${styles.contactCardItem} ${styles.relative}`}>
                    <div className={`${styles.backgroundColorPrimary} ${styles.absolute} ${styles.zIndex1}`}></div>
                    <div className={`${styles.absolute} ${styles.zIndex1}`}>
                      <img 
                        sizes="100vw" 
                        srcSet="https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69e0bf9731d1b6cf8cbe8c30_Call%20us_Contact%20Card-p-500.webp 500w, https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69e0bf9731d1b6cf8cbe8c30_Call%20us_Contact%20Card.webp 619w" 
                        alt="a woman with curly hair wearing pink and green striped shirt" 
                        src="https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69e0bf9731d1b6cf8cbe8c30_Call%20us_Contact%20Card.webp" 
                        loading="lazy" 
                        className={`${styles.imgContain} ${styles.alignRightBtm}`} 
                      />
                    </div>
                    <div className={`${styles.contactCardContent} ${styles.zIndex2}`}>
                      <div className={`${styles.contactCardHeader} ${styles.textColorAlternate}`}>
                        <img 
                          alt="FAQ icon" 
                          src="https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69ce34c47ec851f2324ff3e4_call.svg" 
                          className={styles.iconHeightMedium} 
                        />
                        <h3 className={styles.headingStyleH3}>Call us</h3>
                      </div>
                      <div className={styles.buttonWrapper}>
                        <a 
                          href="tel:0600150023" 
                          className={`${styles.button} ${styles.isReversed} ${styles.isMedium} ${styles.isIconLeft} ${styles.wInlineBlock}`}
                        >
                          <img 
                            loading="lazy" 
                            src="https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69ce34b5bdd139fb6f39558f_phone.svg" 
                            alt="Decorative" 
                            className={styles.icon1x1Medium} 
                          />
                          <div className={styles.textWeightBold}>+91 7976765292</div>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Help yourself */}
                  <div className={`${styles.contactCardItem} ${styles.relative}`}>
                    <div className={`${styles.backgroundColorDgreen} ${styles.absolute} ${styles.zIndex1}`}></div>
                    <div className={`${styles.absolute} ${styles.zIndex1}`}>
                      <img 
                        sizes="100vw" 
                        srcSet="https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69e0bf97bd79912cc12f2139_Help%20yourself_Contact%20Card-p-500.webp 500w, https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69e0bf97bd79912cc12f2139_Help%20yourself_Contact%20Card.webp 619w" 
                        alt="a man looking at a phone" 
                        src="https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69e0bf97bd79912cc12f2139_Help%20yourself_Contact%20Card.webp" 
                        loading="lazy" 
                        className={`${styles.imgContain} ${styles.alignRightBtm}`} 
                      />
                    </div>
                    <div className={`${styles.contactCardContent} ${styles.zIndex2}`}>
                      <div className={`${styles.contactCardHeader} ${styles.textColorAlternate}`}>
                        <img 
                          alt="FAQ icon" 
                          src="https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69ce34c40dd83df1e718f5eb_FAQ%20white.svg" 
                          className={styles.iconHeightMedium} 
                        />
                        <h3 className={styles.headingStyleH3}>Help yourself</h3>
                      </div>
                      <div className={styles.buttonWrapper}>
                        {/** /personal/help-centre */}
                        <a 
                          href="#" 
                          className={`${styles.button} ${styles.isReversed} ${styles.isMedium} ${styles.isIconLeft} ${styles.wInlineBlock}`}
                        >
                          <img 
                            loading="lazy" 
                            src="https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69ce34b4ffcd58b11a90217f_help-circle.svg" 
                            alt="Decorative" 
                            className={styles.icon1x1Medium} 
                          />
                          <div className={styles.textWeightBold}>Explore our FAQs</div>
                        </a>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}