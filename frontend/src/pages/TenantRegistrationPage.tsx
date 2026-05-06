import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, Loader2 } from "lucide-react";
import OrganizationStep from "../components/registration/OrganizationStep";
import ContactStep from "../components/registration/ContactStep";
import UserStep from "../components/registration/UserStep";

const steps = [
  { id: 1, name: "Organization" },
  { id: 2, name: "Contact Info" },
  { id: 3, name: "Administrator" },
];

export default function TenantRegistrationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    organizationName: "",
    location: {
      latitude: "" as number | "",
      longitude: "" as number | "",
    },
    contact: {
      email: "",
      phone: "",
      website: "",
      logo: "",
    },
    user: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      role: "SELLER_OWNER",
    },
  });

  const handleUpdateData = (newData: any) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const validateStep = (step: number) => {
    // Basic validation
    if (step === 1) {
      return formData.organizationName && formData.location.latitude !== "" && formData.location.longitude !== "";
    }
    if (step === 2) {
      return formData.contact.email && formData.contact.phone;
    }
    if (step === 3) {
      return formData.user.firstName && formData.user.lastName && formData.user.email && formData.user.password;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setError(null);
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    } else {
      setError("Please fill in all required fields.");
    }
  };

  const handlePrev = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      setError("Please fill in all required fields.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8085/api/auth/register/platform-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        let errorMessage = "Failed to register tenant";
        try {
          const errorData = await response.json();
          if (errorData.validationErrors) {
            const errors = Object.entries(errorData.validationErrors)
              .map(([field, msg]) => `${field.split('.').pop()}: ${msg}`)
              .join(", ");
            errorMessage = `${errorData.message} - ${errors}`;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseErr) {
          // Fallback if response isn't JSON
        }
        throw new Error(errorMessage);
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-indigo-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Registration Complete</h2>
          <p className="text-slate-400 mb-8">
            The tenant {formData.organizationName} has been successfully registered on the platform.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-medium transition-colors"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 flex flex-col justify-center relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-3xl w-full mx-auto relative z-10">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
          Register New Tenant
        </h1>
        <p className="text-lg text-slate-400 max-w-xl mx-auto">
          Set up a new organization and administrator account on the Rwanda Dash platform.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 rounded-full" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-indigo-500 -translate-y-1/2 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 shadow-lg border-2
                    ${isActive ? "bg-indigo-600 border-indigo-400 text-white scale-110" : 
                      isCompleted ? "bg-indigo-500 border-indigo-500 text-white" : 
                      "bg-slate-800 border-slate-700 text-slate-400"
                    }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : step.id}
                </div>
                <span className={`mt-3 text-sm font-medium transition-colors ${isActive ? "text-indigo-400" : "text-slate-500"}`}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 p-8 sm:p-10">
        
        {error && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/50 text-rose-400 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="min-h-[360px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {currentStep === 1 && (
                <OrganizationStep data={formData} updateData={handleUpdateData} />
              )}
              {currentStep === 2 && (
                <ContactStep data={formData} updateData={handleUpdateData} />
              )}
              {currentStep === 3 && (
                <UserStep data={formData} updateData={handleUpdateData} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="mt-10 pt-6 border-t border-slate-700/50 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`flex items-center px-5 py-2.5 rounded-xl text-sm font-medium transition-all
              ${currentStep === 1 
                ? "opacity-0 pointer-events-none" 
                : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
              }`}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={handleNext}
              className="flex items-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/25"
            >
              Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/25"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  Complete Registration
                  <Check className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
