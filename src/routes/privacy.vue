<template>
  <div class="page privacy-page">
    <div class="text-container">
      <h1>
        Privacy Policy
      </h1>

      <p>
        Renascent, Inc. is committed to protecting the integrity and privacy of personal information gathered from users of Retina through all of our communication channels. If you are a visitor, we do not collect information unless you register to become a customer. If you are a customer, the information collected (name, postal address, email address, phone number) is never shared or sold.
      </p>

      <p>
        The protection of your privacy is of great importance to us, we have created this privacy policy to communicate our practices regarding the collection and dissemination of personal information that you provide to us and that can be linked to a specific individual, such as a name, postal address, telephone number(s), email address, or any other information, provided to us by our partners and Site visitors (hereinafter "Personal Information"), as well as certain non-personally identifiable information collected when you visit many of our web pages such as the type of browser you are using (e.g. Internet Explorer or Firefox), the type of operating system you are using (e.g., Windows XP or Mac OS), the domain name of your internet service provider (e.g., Comcast or Verizon), aggregate data about the number of visits to the Site and/or aggregate data about the pages visited (hereinafter "Aggregate Data").
      </p>

      <p>
        This policy will be updated periodically, so please be sure to reread it from time to time. By submitting your personal information to us, you are agreeing that Retina may use the information in accordance with this privacy policy.
      </p>

      <h2>
        Collection and Use of Personal Information
      </h2>

      <p>
        Retina collects Personal Information supplied to us voluntarily by customers and visitors to this Site. We may use such voluntarily provided information to improve our understanding of your interests, to improve our services, or to contact you about issues that may affect you. In order to utilize certain features of our site or receive information from Retina or become a customer, you may choose to provide Personal Information. If you do submit information to us, we will use that information for the purposes for which it was submitted. We may also use your name, postal address and telephone number(s) to contact you offline.
      </p>

      <p>
        Retina uses third-party vendors to provide services on this Site and in offline business operations. The information that you submit on this site may be provided to those vendors on a confidential basis so that those vendors can provide services (such as maintaining our database or sending email messages) on our behalf.
      </p>

      <p>
        Other than as described in this privacy policy, or as may be necessary to protect the rights, property, and safety of Retina or others, or as may be necessary to comply with applicable law, Retina will not share or sell the Personal Information you provide online.
      </p>

      <h2>
        Use of Email Address
      </h2>

      <p>
        When you contact us or sign up as a partner on our Site, you will be asked to supply your email address. Retina does not sell or rent your email address to any third party. Email addresses gathered from partners of Retina are only available to employees managing this information for purposes of contacting you or sending you emails based on your request for information, and to contracted service providers and vendors for purposes of providing services relating to our communications with you.
      </p>

      <h2>
        User Submissions
      </h2>

      <p>
        Retina welcomes your comments and feedback on its site. However, you acknowledge that you are responsible for your own communications and are responsible for the consequences of their posting. Therefore, do not impersonate another person or business.
      </p>

      <h2>
        Children
      </h2>

      <p>
        Retina does not knowingly gather any personally identifiable information from children under the age of 13. You must be 13 years of age or older to access the site. Retina has no interest in collecting information from children under the age of 13.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Privacy'
}
</script>

<style lang="scss">
@import '../styles/variables';

.privacy-page {
  background-color: #fff;
  overflow-y: auto;
  padding: 50px;
  width: calc(100% - 100px);
  height: calc(100% - 100px);

  .logo {
    height: 30vh;
    width: 30vh;
  }

  h1 {
    font-weight: 900;
  }

  h1 {
    font-weight: 700;
  }

  p {
    font-weight: 200;
    font-size: 17px;
  }
}
</style>
