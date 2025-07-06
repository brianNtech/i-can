import React from 'react';
import Accordion from '../components/Accordion';
import { NavLink } from 'react-router-dom';

const companies = [
  { name: 'Astra', logo: 'https://picsum.photos/seed/astra-logo/150/70?grayscale' },
  { name: 'PERTAMINA', logo: 'https://picsum.photos/seed/pertamina-logo/150/70?grayscale' },
  { name: 'BCA', logo: 'https://picsum.photos/seed/bca-logo/150/70?grayscale' },
  { name: 'BRI', logo: 'https://picsum.photos/seed/bri-logo/150/70?grayscale' },
  { name: 'BNI', logo: 'https://picsum.photos/seed/bni-logo/150/70?grayscale' },
];

const faqs = [
  { q: "Bagaimana cara terbaik mencari kerja di I-CAN?", a: "Manfaatkan fitur filter di Job Portal kami untuk menyaring berdasarkan gaji, lokasi, dan kata kunci. Jangan lupa lengkapi profil Anda agar HRD dapat menemukan Anda!" },
  { q: "Apakah sertifikasi di I-CAN diakui secara internasional?", a: "Ya, kami bekerja sama dengan lembaga sertifikasi terkemuka untuk menyediakan kualifikasi yang diakui secara global seperti CompTIA dan AWS." },
];

const interviewTips = ["Berpakaian Rapi saat interview", "Percaya Diri", "Jujur", "Membawa Dokumen Lengkap", "Datang Tepat Waktu"];
const cvTips = ["Memiliki tulisan yang rapih", "Tidak memiliki banyak gambar", "Memiliki desain sederhana", "Gunakan format grayscale", "Fokus pada pencapaian"];

const LandingPage: React.FC = () => {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="text-center pt-16 pb-20">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">Unlock Your</span>
          <span className="block">Career Potential.</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
          I-CAN is your ultimate partner in navigating the professional world. Find jobs, get certified, and grow with our AI-powered career guidance.
        </p>
        <div className="mt-8 flex justify-center gap-4">
            <NavLink to="/jobs" className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                Find Your Dream Job
            </NavLink>
            <NavLink to="/career-guide" className="inline-block bg-white dark:bg-navy-800 text-blue-500 dark:text-blue-300 font-semibold px-8 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                Get Career Advice
            </NavLink>
        </div>
      </section>

      {/* Featured Companies */}
      <section>
        <h3 className="text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Trusted by top companies in Indonesia
        </h3>
        <div className="mt-8 flow-root">
          <div className="flex flex-wrap justify-center gap-8 lg:gap-16 items-center">
            {companies.map(company => (
              <img key={company.name} className="h-10 transition-transform duration-300 hover:scale-110" src={company.logo} alt={company.name} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ and Tips Section */}
      <section className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map(faq => (
              <Accordion key={faq.q} title={faq.q}>
                <p>{faq.a}</p>
              </Accordion>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-6">Pro Tips for Success</h2>
            <div className="space-y-4">
                <Accordion title="Tips Lolos Interview">
                    <ul className="list-disc list-inside space-y-2">
                        {interviewTips.map(tip => <li key={tip}>{tip}</li>)}
                    </ul>
                </Accordion>
                <Accordion title="Tips Menulis CV ATS-Friendly">
                    <ul className="list-disc list-inside space-y-2">
                        {cvTips.map(tip => <li key={tip}>{tip}</li>)}
                    </ul>
                </Accordion>
            </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
