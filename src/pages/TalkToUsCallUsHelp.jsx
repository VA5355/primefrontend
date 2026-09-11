import React from 'react';

// Define the functional component
function TalkToUsCallUsHelp() {
  const message = "Welcome to your first React component!";

  return (
    <div className="w-layout-blockcontainer container-medium w-container">
  <div className="contact-cards_inner">
    <div className="contact-card_item relative">
      <div className="background-color-agreen absolute z-index-1" />
      <div className="absolute z-index-1">
       {/*  <img
          alt="a man pointing up with his finger"
          className="img-contain align_right-btm"
          loading="lazy"
          sizes="100vw"
          src="https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69e0bf97f8396022efe2336e_Talk%20to%20us_Contact%20Card.webp"
          srcSet="https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69e0bf97f8396022efe2336e_Talk%20to%20us_Contact%20Card-p-500.webp 500w, https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69e0bf97f8396022efe2336e_Talk%20to%20us_Contact%20Card.webp 619w"
        />*/}
      </div>
      <div className="contact-card_content z-index-2">
        <div className="contact-card_header text-color-darkest-green">
          <img
            alt="FAQ icon"
            className="icon-height-medium"
            src="https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69ce34c601aebebcd981dcf0_whatsapp-24.svg"
          />
          <h3 className="heading-style-h3">Talk to us</h3>
        </div>
        <div className="button-wrapper">
          <a
            className="button is-reversed is-medium is-icon-left w-inline-block"
            href="https://api.whatsapp.com/send/?phone=%2B27600150023&text&type=phone_number&app_absent=0"
            target="_blank">
           {/*   <img
              alt="Decorative"
              className="icon-1x1-medium"
              loading="lazy"
              src="https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69ce34b464f8deba98e346fd_Help%20alt.svg"
            /> */}
            <div className="text-weight-bold">Chat to support</div>
          </a>
        </div>
      </div>
    </div>
    <div className="contact-card_item relative">
      <div className="background-color-primary absolute z-index-1" />
      <div className="absolute z-index-1">
       {/* <img
          alt="a woman with curly hair wearing pink and green striped shirt"
          className="img-contain align_right-btm"
          loading="lazy"
          sizes="100vw"
          src="https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69e0bf9731d1b6cf8cbe8c30_Call%20us_Contact%20Card.webp"
          srcSet="https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69e0bf9731d1b6cf8cbe8c30_Call%20us_Contact%20Card-p-500.webp 500w, https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69e0bf9731d1b6cf8cbe8c30_Call%20us_Contact%20Card.webp 619w"
        />*/}
      </div>
      <div className="contact-card_content z-index-2">
        <div className="contact-card_header text-color-alternate">
          <img
            alt="FAQ icon"
            className="icon-height-medium"
            src="https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69ce34c47ec851f2324ff3e4_call.svg"
          />
          <h3 className="heading-style-h3">Call us</h3>
        </div>
        <div className="button-wrapper">
          <a
            className="button is-reversed is-medium is-icon-left w-inline-block"
            href="tel:0600150023">
           {/* <img
              alt="Decorative"
              className="icon-1x1-medium"
              loading="lazy"
              src="https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69ce34b5bdd139fb6f39558f_phone.svg"
            />*/}
            <div className="text-weight-bold">060 015 0023</div>
          </a>
        </div>
      </div>
    </div>
    <div className="contact-card_item relative">
      <div className="background-color-dgreen absolute z-index-1" />
      <div className="absolute z-index-1">
       {/*   <img
          alt="a man looking at a phone"
          className="img-contain align_right-btm"
          loading="lazy"
          sizes="100vw"
          src="https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69e0bf97bd79912cc12f2139_Help%20yourself_Contact%20Card.webp"
          srcSet="https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69e0bf97bd79912cc12f2139_Help%20yourself_Contact%20Card-p-500.webp 500w, https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69e0bf97bd79912cc12f2139_Help%20yourself_Contact%20Card.webp 619w"
        /> */}
      </div>
      <div className="contact-card_content z-index-2">
        <div className="contact-card_header text-color-alternate">
          <img
            alt="FAQ icon"
            className="icon-height-medium"
            src="https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69ce34c40dd83df1e718f5eb_FAQ%20white.svg"
          />
          <h3 className="heading-style-h3">Help yourself</h3>
        </div>
        <div className="button-wrapper">
          <a
            className="button is-reversed is-medium is-icon-left w-inline-block"
            href="/personal/help-centre">
           {/*  <img
              alt="Decorative"
              className="icon-1x1-medium"
              loading="lazy"
              src="https://cdn.prod.website-files.com/69bbb238aaf445ea6da79a10/69ce34b4ffcd58b11a90217f_help-circle.svg"
            /> */}
            <div className="text-weight-bold">Explore our FAQs</div>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}

// Export the component so it can be used in other files
export default TalkToUsCallUsHelp;
