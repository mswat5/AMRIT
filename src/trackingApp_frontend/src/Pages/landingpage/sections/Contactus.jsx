import ContactForm from "../components/ContactForm";
import Socials from "../components/Socials";

export default function ContactUs() {
  return (
    <section id="contact" className="py-10 md:py-16 px-6">
      <div className="container mx-auto px-4 md:px-6 py-6 ">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-800 dark:text-white">
              Get in touch
            </h2>
            <p className="text-gray-600">
              Fill out the form and we’ll get back to you as soon as possible.
            </p>
            <Socials />
          </div>

          <div className="mt-6 lg:mt-0">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
