'use client';

import { Check, ShoppingCart, Truck } from "lucide-react";

interface CheckoutStepperProps {
  currentStep: number;
}

export default function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const steps = [
    { name: 'Shopping Cart', icon: ShoppingCart },
    { name: 'Review & Checkout', icon: Check },
    { name: 'Order Confirmed', icon: Truck },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center">
        {steps.map((step, index) => (
          <>
            <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  index < currentStep ? 'bg-green-600 text-white' : 
                  index === currentStep ? 'bg-green-200 text-green-800 border-2 border-green-600' : 
                  'bg-gray-200 text-gray-500'
              }`}>
                <step.icon className="w-5 h-5" />
              </div>
              <p className={`mt-2 text-xs text-center ${index <= currentStep ? 'font-semibold text-green-800' : 'text-gray-500'}`}>
                {step.name}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 ${index < currentStep ? 'bg-green-600' : 'bg-gray-200'}`} />
            )}
          </>
        ))}
      </div>
    </div>
  );
}