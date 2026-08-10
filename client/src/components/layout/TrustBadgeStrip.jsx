import { LuTruck, LuUndo2, LuWallet, LuGift, LuHeadphones } from 'react-icons/lu';

const badges = [
  { icon: LuTruck, title: 'Free Shipping', subtitle: 'For all Orders Over $100' },
  { icon: LuUndo2, title: '30 Days Returns', subtitle: 'For an Exchange Product' },
  { icon: LuWallet, title: 'Secured Payment', subtitle: 'Payment Cards Accepted' },
  { icon: LuGift, title: 'Special Gifts', subtitle: 'Our First Product Order' },
  { icon: LuHeadphones, title: 'Support 24/7', subtitle: 'Contact us Anytime' },
];

export default function TrustBadgeStrip() {
  return (
    <div className="grid grid-cols-2 gap-6 border-t border-gray-100 bg-gray-50 px-6 py-8 sm:grid-cols-3 lg:grid-cols-5 lg:px-10">
      {badges.map((b) => (
        <div key={b.title} className="flex flex-col items-center gap-2 text-center">
          <b.icon size={26} className="text-gray-700" />
          <p className="text-sm font-semibold text-gray-800">{b.title}</p>
          <p className="text-xs text-gray-500">{b.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
