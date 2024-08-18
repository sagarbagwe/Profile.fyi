import {create} from 'zustand';

const usePromoCodeStore = create((set) => ({
  promoCode: '',
  appliedDiscount: 0,

  setPromoCode: (code) => {
    set((state) => ({
      promoCode: code,
    }));
  },

  setAppliedDiscount: (discount) => {
    set((state) => ({
      appliedDiscount: discount,
    }));
  },
}));

export default usePromoCodeStore;