import { Mail, Phone, Globe, Image as ImageIcon } from "lucide-react";

interface ContactStepProps {
  data: {
    contact: {
      email: string;
      phone: string;
      website: string;
      logo: string;
    };
  };
  updateData: (fields: any) => void;
}

const ContactStep = ({ data, updateData }: ContactStepProps) => {
  const updateContact = (field: string, value: string) => {
    updateData({
      contact: { ...data.contact, [field]: value },
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-100">Contact Information</h2>
        <p className="text-slate-400 mt-2 text-sm">How can customers reach your organization?</p>
      </div>

      <div className="space-y-4">
        {/* Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Contact Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="email"
                value={data.contact.email}
                onChange={(e) => updateContact("email", e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-xl leading-5 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                placeholder="contact@acmecorp.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="tel"
                value={data.contact.phone}
                onChange={(e) => updateContact("phone", e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-xl leading-5 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                placeholder="+250123456789"
                required
              />
            </div>
          </div>
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Website URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="url"
              value={data.contact.website}
              onChange={(e) => updateContact("website", e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-xl leading-5 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
              placeholder="https://acmecorp.com"
            />
          </div>
        </div>

        {/* Logo URL */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Logo URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ImageIcon className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="url"
              value={data.contact.logo}
              onChange={(e) => updateContact("logo", e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-xl leading-5 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
              placeholder="https://example.com/logo.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactStep;
