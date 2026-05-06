import { Building, MapPin, Crosshair } from "lucide-react";
import { useState } from "react";

interface OrganizationStepProps {
  data: {
    organizationName: string;
    location: {
      latitude: number | "";
      longitude: number | "";
    };
  };
  updateData: (fields: any) => void;
}

const OrganizationStep = ({ data, updateData }: OrganizationStepProps) => {
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      setIsLocating(true);
      setLocationError("");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateData({
            location: {
              latitude: Number(position.coords.latitude.toFixed(6)),
              longitude: Number(position.coords.longitude.toFixed(6)),
            },
          });
          setIsLocating(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationError("Unable to retrieve your location. Please ensure you have granted permission.");
          setIsLocating(false);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser");
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    // Match common coordinate formats like "lat, lng" or "lat lng"
    // Clean up string first (e.g. from Google Maps format)
    const cleanedText = pastedText.trim().replace(/[()]/g, '');
    const coords = cleanedText.split(/[, \t]+/);
    if (coords.length >= 2) {
      const lat = parseFloat(coords[0]);
      const lng = parseFloat(coords[1]);
      if (!isNaN(lat) && !isNaN(lng)) {
        e.preventDefault();
        updateData({
          location: {
            latitude: lat,
            longitude: lng,
          },
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-100">Organization Details</h2>
        <p className="text-slate-400 mt-2 text-sm">Tell us about your organization to get started.</p>
      </div>

      <div className="space-y-4">
        {/* Organization Name */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Organization Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="text"
              value={data.organizationName}
              onChange={(e) => updateData({ organizationName: e.target.value })}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-xl leading-5 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
              placeholder="Acme Corp"
              required
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <div className="flex justify-between items-end mb-1.5">
            <label className="block text-sm font-medium text-slate-300">
              Location Coordinates
            </label>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={isLocating}
              className="flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300 focus:outline-none disabled:opacity-50 transition-colors"
            >
              <Crosshair className={`h-3 w-3 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : 'Get Current Location'}</span>
            </button>
          </div>
          
          {locationError && (
            <p className="text-red-400 text-xs mb-2">{locationError}</p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="number"
                step="any"
                value={data.location.latitude}
                onPaste={handlePaste}
                onChange={(e) =>
                  updateData({
                    location: { ...data.location, latitude: e.target.value ? parseFloat(e.target.value) : "" },
                  })
                }
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-xl leading-5 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                placeholder="Lat: -1.9441"
                required
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="number"
                step="any"
                value={data.location.longitude}
                onPaste={handlePaste}
                onChange={(e) =>
                  updateData({
                    location: { ...data.location, longitude: e.target.value ? parseFloat(e.target.value) : "" },
                  })
                }
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-xl leading-5 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                placeholder="Lng: 30.0619"
                required
              />
            </div>
          </div>
          <p className="text-slate-500 mt-2 text-xs">
            You can paste coordinates (e.g., "-1.9441, 30.0619") into either field.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrganizationStep;
