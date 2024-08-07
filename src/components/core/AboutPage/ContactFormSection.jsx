import React from "react";
import ContactUsForm from "../ContactUsPage/ContactUsForm";

const ContactFormSection = () => {
  return (
    <div className="mx-auto bg-black border-t border-pure-greys-500">
      <h1 className=" mt-3 text-center text-3xl font-semibold ">Get in Touch</h1>
      <p className="text-center font-bold text-richblack-300 mt-3">
        We&apos;d love to here for you, Please fill out this form.
      </p>
      <div className="mt-12 mx-auto px-4">
        <ContactUsForm />
      </div>
    </div>
  );
};

export default ContactFormSection;
