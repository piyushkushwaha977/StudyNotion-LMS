import React from "react"

import Footer from "../components/common/Footer"
import ReviewSlider from "../components/common/ReviewSlider"
import ContactDetails from "../components/core/ContactUsPage/ContactDetails"
import ContactForm from "../components/core/ContactUsPage/ContactForm"

const ContactUsPage = () => {
  return (
    <div className=" bg-[#060606] ">
      <div className="mx-auto  flex w-11/12 max-w-maxContent flex-col justify-between gap-6 text-white lg:flex-row">
        {/* Contact Details */}
        <div className="lg:w-[35%] mt-20 md:mt-36">
          <ContactDetails />
        </div>

        {/* Contact Form */}
        <div className="lg:w-[50%] md:mt-20 bg-[#121212]">
          <ContactForm />
        </div>
      </div>
      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-white">
        {/* Reviws from Other Learner */}
        <ReviewSlider />
      </div>
      <div className=" bg-black ">
      <Footer />
      </div>
    </div>
  )
}

export default ContactUsPage
