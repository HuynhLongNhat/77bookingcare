import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Calendar, Clock, User } from "lucide-react";

const HomePage = () => (
  <>
  <Header/>
    <main className="pt-32 pb-16">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Đặt Lịch Khám Bệnh Trực Tuyến
            </h1>
            <p className="text-xl mb-8">
              Tiết kiệm thời gian, chủ động lựa chọn bác sĩ và thời gian khám
              bệnh
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-medium hover:bg-blue-50 transition-colors">
              Đặt lịch ngay
            </button>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tại sao chọn 77BookingCare?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg shadow-lg">
              <Calendar size={48} className="mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-3">Đặt Lịch Dễ Dàng</h3>
              <p className="text-gray-600">
                Đặt lịch khám chỉ với vài bước đơn giản, mọi lúc mọi nơi
              </p>
            </div>
            <div className="text-center p-6 rounded-lg shadow-lg">
              <User size={48} className="mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-3">Bác Sĩ Chuyên Khoa</h3>
              <p className="text-gray-600">
                Đội ngũ bác sĩ giàu kinh nghiệm từ các bệnh viện uy tín
              </p>
            </div>
            <div className="text-center p-6 rounded-lg shadow-lg">
              <Clock size={48} className="mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-3">
                Tiết Kiệm Thời Gian
              </h3>
              <p className="text-gray-600">
                Không phải chờ đợi, chủ động lựa chọn thời gian khám
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer/>
  </>
);

export default HomePage;
