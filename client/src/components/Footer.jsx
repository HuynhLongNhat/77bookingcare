
import { Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => (
  <footer className="bg-gray-900 text-white">
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">77BookingCare</h3>
          <p className="text-gray-400 mb-4">
            Nền tảng đặt lịch khám bệnh trực tuyến hàng đầu Việt Nam
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Twitter size={20} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Liên kết nhanh</h4>
          <ul className="space-y-2">
            <li>
              <a href="/" className="text-gray-400 hover:text-white">
                Trang chủ
              </a>
            </li>
            <li>
              <a href="/about" className="text-gray-400 hover:text-white">
                Về chúng tôi
              </a>
            </li>
            <li>
              <a href="/services" className="text-gray-400 hover:text-white">
                Dịch vụ
              </a>
            </li>
            <li>
              <a href="/contact" className="text-gray-400 hover:text-white">
                Liên hệ
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Chuyên khoa</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-gray-400 hover:text-white">
                Tim mạch
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-white">
                Thần kinh
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-white">
                Nhi khoa
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-white">
                Da liễu
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <Phone size={16} className="mr-2 text-gray-400" />
              <span className="text-gray-400">1900 1077</span>
            </div>
            <div className="flex items-center">
              <Mail size={16} className="mr-2 text-gray-400" />
              <span className="text-gray-400">contact@77bookingcare.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
        <p>&copy; 2024 77BookingCare. Tất cả quyền được bảo lưu.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
