import React, { useState } from 'react';
import { X, Plus, Trash2, ArrowRight, ArrowLeft, Check, Package, Truck, FileText } from 'lucide-react';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface DeliveryInfo {
  fullName: string;
  phone: string;
  address: string;
  city: string;
}

const OrderModal = ({ isOpen, onClose }: OrderModalProps) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [items, setItems] = useState<OrderItem[]>([
    { id: '1', name: '', quantity: 1, price: 0 }
  ]);
  const [notes, setNotes] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    fullName: '',
    phone: '',
    address: '',
    city: ''
  });

  if (!isOpen) return null;

  // --- Helpers ---
  const handleAddItem = () => {
    setItems([...items, { id: Date.now().toString(), name: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleItemChange = (id: string, field: keyof OrderItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  // --- Handlers ---
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) setStep((prev) => (prev + 1) as 1 | 2 | 3);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep((prev) => (prev - 1) as 1 | 2 | 3);
  };

  const handleSubmit = () => {
    console.log("Order Submitted", { items, notes, deliveryInfo, total: calculateTotal() });
    
    // Reset state after submission
    setStep(1);
    setItems([{ id: '1', name: '', quantity: 1, price: 0 }]);
    setNotes('');
    setDeliveryInfo({ fullName: '', phone: '', address: '', city: '' });
    onClose();
  };

  // --- Renders ---
  const renderStepper = () => (
    <div className="flex items-center justify-between px-8 py-4 bg-slate-50 border-b border-slate-100">
      {[
        { num: 1, label: 'Items', icon: Package },
        { num: 2, label: 'Delivery', icon: Truck },
        { num: 3, label: 'Preview', icon: FileText }
      ].map((s, i) => (
        <React.Fragment key={s.num}>
          <div className="flex flex-col items-center gap-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
              step >= s.num 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-200 text-slate-400'
            }`}>
              <s.icon className="w-5 h-5" />
            </div>
            <span className={`text-xs font-medium ${step >= s.num ? 'text-slate-800' : 'text-slate-400'}`}>
              {s.label}
            </span>
          </div>
          {i < 2 && (
            <div className={`flex-1 h-0.5 mx-4 transition-colors duration-300 ${
              step > s.num ? 'bg-indigo-600' : 'bg-slate-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <form id="step-form" onSubmit={handleNextStep} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-700 uppercase tracking-wider">Order Items</h3>
          <button
            type="button"
            onClick={handleAddItem}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>

        {items.map((item) => (
          <div key={item.id} className="flex gap-3 items-start bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 mb-1">Item Name</label>
              <input
                type="text"
                required
                value={item.name}
                onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm"
                placeholder="e.g. Premium Widget"
              />
            </div>
            <div className="w-24">
              <label className="block text-xs font-medium text-slate-500 mb-1">Qty</label>
              <input
                type="number"
                required
                min="1"
                value={item.quantity}
                onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm"
              />
            </div>
            <div className="w-32">
              <label className="block text-xs font-medium text-slate-500 mb-1">Price ($)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={item.price}
                onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm"
              />
            </div>
            <div className="pt-6">
              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                disabled={items.length === 1}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Order Notes (Optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm resize-none"
          placeholder="Special instructions..."
        />
      </div>
    </form>
  );

  const renderStep2 = () => (
    <form id="step-form" onSubmit={handleNextStep} className="space-y-6">
      <h3 className="text-sm font-medium text-slate-700 uppercase tracking-wider mb-4">Delivery Information</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={deliveryInfo.fullName}
            onChange={(e) => setDeliveryInfo({ ...deliveryInfo, fullName: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm"
            placeholder="John Doe"
          />
        </div>
        
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
          <input
            type="tel"
            required
            value={deliveryInfo.phone}
            onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Address</label>
          <textarea
            required
            rows={2}
            value={deliveryInfo.address}
            onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm resize-none"
            placeholder="123 Main St, Apt 4B"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">City / Region</label>
          <input
            type="text"
            required
            value={deliveryInfo.city}
            onChange={(e) => setDeliveryInfo({ ...deliveryInfo, city: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm"
            placeholder="Kigali"
          />
        </div>
      </div>
    </form>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-sm font-medium text-slate-700 uppercase tracking-wider mb-4">Order Preview</h3>
      
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
        {/* Delivery Summary */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase">Deliver To</h4>
          <div className="text-sm text-slate-800">
            <p className="font-medium">{deliveryInfo.fullName}</p>
            <p>{deliveryInfo.phone}</p>
            <p>{deliveryInfo.address}</p>
            <p>{deliveryInfo.city}</p>
          </div>
        </div>

        <div className="w-full h-px bg-slate-200 my-2" />

        {/* Items Summary */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase">Order Items</h4>
          <ul className="space-y-2">
            {items.map(item => (
              <li key={item.id} className="flex justify-between text-sm text-slate-800">
                <span>{item.quantity}x {item.name || 'Unnamed Item'}</span>
                <span className="font-medium">${(item.quantity * item.price).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {notes && (
          <>
            <div className="w-full h-px bg-slate-200 my-2" />
            <div>
              <h4 className="text-xs font-semibold text-slate-500 mb-1 uppercase">Notes</h4>
              <p className="text-sm text-slate-700 italic">{notes}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-800">Create New Order</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper */}
        {renderStepper()}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
          <div className="text-slate-600">
            Total: <span className="text-lg font-bold text-slate-900">${calculateTotal().toFixed(2)}</span>
          </div>
          <div className="flex gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}

            {step < 3 ? (
              <button
                type="submit"
                form="step-form"
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-lg shadow-sm shadow-indigo-600/20 transition-all"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 active:scale-95 rounded-lg shadow-sm shadow-green-600/20 transition-all"
              >
                <Check className="w-4 h-4" /> Submit Order
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderModal;
