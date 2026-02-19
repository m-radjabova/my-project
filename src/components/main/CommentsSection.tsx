import { FaStar, FaQuoteRight, FaRegSmile, FaRegHeart, FaRegCommentDots } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import { GiCrown, GiSparkles, GiPartyPopper } from "react-icons/gi";
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

type CommentItem = {
  id: number;
  fullName: string;
  game: string;
  rating: number;
  comment: string;
  avatar: string;
  image?: string;
  likes?: number;
  timeAgo?: string;
};

const comments: CommentItem[] = [
  {
    id: 1,
    fullName: "Muslima Radjabova",
    game: "Quiz Battle",
    rating: 5,
    comment: "Savollar juda qiziqarli ekan, do'stlarim bilan yana o'ynayman. Har safar yangi bilimlar o'rganaman!",
    avatar: "https://i.pravatar.cc/150?img=20",
    likes: 24,
    timeAgo: "2 soat oldin"
  },
  {
    id: 2,
    fullName: "Azizbek Sodiqov",
    game: "Treasure Hunt",
    rating: 4,
    comment: "Topishmoqlar yaxshi, dizayn ham yoqdi. Yana yangi bosqich kutyapman. Grafikasi ajoyib!",
    avatar: "https://i.pravatar.cc/150?img=2",
    likes: 18,
    timeAgo: "5 soat oldin"
  },
  {
    id: 3,
    fullName: "Shahnoza Karimova",
    game: "Quiz Battle",
    rating: 5,
    comment: "Reyting tizimi zo'r ishlagan, har safar yaxshiroq natija qilgim keladi. Rahmat!",
    avatar: "https://i.pravatar.cc/150?img=24",
    likes: 32,
    timeAgo: "1 kun oldin"
  },
  {
    id: 4,
    fullName: "Javohir Tursunov",
    game: "Treasure Hunt",
    rating: 4,
    comment: "Interfeys tushunarli. O'yin jarayoni zeriktirmaydi. Do'stlarimga ham tavsiya qildim.",
    avatar: "https://i.pravatar.cc/150?img=4",
    likes: 15,
    timeAgo: "2 kun oldin"
  },
  {
    id: 5,
    fullName: "Dilnoza Abdurahmonova",
    game: "Memory Game",
    rating: 5,
    comment: "Bolam uchun juda foydali ekan. Xotirasi mustahkamlandi va o'ynab o'rganyapti.",
    avatar: "https://i.pravatar.cc/150?img=5",
    likes: 45,
    timeAgo: "3 kun oldin"
  },
  {
    id: 6,
    fullName: "Bekzod Alimov",
    game: "Math Challenge",
    rating: 5,
    comment: "Matematika o'rganish bunchalik qiziqarli bo'lishini bilmaganman. 10/10",
    avatar: "https://i.pravatar.cc/150?img=7",
    likes: 27,
    timeAgo: "4 kun oldin"
  },
  {
    id: 7,
    fullName: "Madina Xasanova",
    game: "Word Puzzle",
    rating: 4,
    comment: "Ingliz tilini o'rganishga juda yordam beradi. Har kuni o'ynayman. 10/10",
    avatar: "https://i.pravatar.cc/150?img=26",
    likes: 21,
    timeAgo: "5 kun oldin"
  },
  {
    id: 8,
    fullName: "Sardor Rahimov",
    game: "Quiz Battle",
    rating: 5,
    comment: "Raqobat juda qiziqarli. Do'stlarim bilan kim yaxshi natija qilishni ko'ryapmiz.",
    avatar: "https://i.pravatar.cc/150?img=8",
    likes: 38,
    timeAgo: "1 hafta oldin"
  }
];

function CommentsSection() {
  const [visibleComments, setVisibleComments] = useState(8);
  const [likedComments, setLikedComments] = useState<number[]>([]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  const loadMore = () => {
    setVisibleComments(prev => Math.min(prev + 4, comments.length));
  };

  const handleLike = (id: number) => {
    setLikedComments(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <section
      id="comments"
      className="relative overflow-hidden bg-gradient-to-br from-[#0f0c1f] via-[#1a1a2e] to-[#16213e] py-20 lg:py-28"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating stars */}
        <div className="absolute top-10 left-[10%] animate-float-slow">
          <GiSparkles className="text-6xl text-[#ffd966]/10" />
        </div>
        <div className="absolute bottom-20 right-[15%] animate-float">
          <GiCrown className="text-7xl text-[#ffb347]/10" />
        </div>
        <div className="absolute top-1/3 right-[5%] animate-pulse-slow">
          <GiPartyPopper className="text-8xl text-[#d42d73]/10" />
        </div>

        {/* Orbital rings */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
          <div className="relative w-[800px] h-[800px]">
            <div className="absolute inset-0 border-4 border-white/5 rounded-full animate-spin-slow" />
            <div className="absolute inset-32 border-2 border-white/10 rounded-full animate-spin-slower" />
            <div className="absolute inset-64 border border-white/20 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-[#d42d73] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-20 w-96 h-96 bg-[#ffb347] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-20 w-96 h-96 bg-[#4f46e5] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center lg:mb-16" data-aos="fade-down">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full mb-4 border border-white/20">
            <GiSparkles className="text-[#ffd966] animate-pulse" />
            <span className="text-xs font-black tracking-[0.2em] text-white/80">
              FOYDALANUVCHILAR FIKRI
            </span>
            <GiSparkles className="text-[#ffb347] animate-pulse" />
          </div>
          
          <h2 className="font-bebas text-5xl leading-none text-white sm:text-6xl lg:text-7xl mb-4">
            NIMA UCHUN BIZNI
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ffd966] to-[#ffb347]">
              TANLASHADI?
            </span>
          </h2>
          
          <p className="text-white/60 text-sm max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
            1000+ dan ortiq foydalanuvchilar bizning o'yinlarimiz orqali o'rganishdan zavqlanishmoqda
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-8" data-aos="fade-up" data-aos-delay="300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffd966] to-[#ffb347] flex items-center justify-center">
                <FaRegSmile className="text-[#1a1a2e]" />
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-lg">2.3k+</p>
                <p className="text-white/60 text-xs">Mamnun foydalanuvchilar</p>
              </div>
            </div>
            <div className="w-px h-8 bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffd966] to-[#ffb347] flex items-center justify-center">
                <FaStar className="text-[#1a1a2e]" />
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-lg">4.9</p>
                <p className="text-white/60 text-xs">O'rtacha reyting</p>
              </div>
            </div>
            <div className="w-px h-8 bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffd966] to-[#ffb347] flex items-center justify-center">
                <FaRegCommentDots className="text-[#1a1a2e]" />
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-lg">1.5k+</p>
                <p className="text-white/60 text-xs">Izohlar</p>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {comments.slice(0, visibleComments).map((item, index) => (
            <article
              key={item.id}
              className="group relative"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* Card glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ffd966] to-[#ffb347] rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
              
              {/* Main Card */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-500 hover:-translate-y-2">
                {/* Floating badge */}
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#ffd966] to-[#ffb347] rounded-full p-2 shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  <FaQuoteRight className="text-xs text-[#1a1a2e]" />
                </div>

                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ffd966] to-[#ffb347] rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity" />
                    <img
                      src={item.avatar}
                      alt={item.fullName}
                      className="relative w-12 h-12 rounded-full object-cover border-2 border-white/20 group-hover:border-white/40 transition-all"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#1a1a2e] animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-sm flex items-center gap-1">
                      {item.fullName}
                      {item.rating === 5 && (
                        <GiCrown className="text-[#ffd966] text-xs" />
                      )}
                    </h3>
                    <p className="text-[#ffb347] text-xs font-semibold">{item.game}</p>
                    <p className="text-white/40 text-[10px] mt-0.5">{item.timeAgo}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      className={`transition-all duration-300 ${
                        i < item.rating 
                          ? 'text-[#ffd966] drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]' 
                          : 'text-white/20'
                      }`}
                      size={14}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-white/80 text-sm leading-relaxed mb-4 line-clamp-3">
                  "{item.comment}"
                </p>

                {/* Footer - Likes */}
                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                  <button
                    onClick={() => handleLike(item.id)}
                    className="flex items-center gap-1.5 group/btn"
                  >
                    <FaRegHeart
                      className={`transition-all duration-300 ${
                        likedComments.includes(item.id)
                          ? 'text-[#ff4d4d] scale-110'
                          : 'text-white/40 group-hover/btn:text-[#ff4d4d] group-hover/btn:scale-110'
                      }`}
                      size={14}
                    />
                    <span className="text-xs text-white/40 group-hover/btn:text-white/60 transition-colors">
                      {item.likes! + (likedComments.includes(item.id) ? 1 : 0)}
                    </span>
                  </button>
                  
                  <button className="text-white/40 hover:text-white/60 transition-colors">
                    <FiMoreHorizontal size={16} />
                  </button>
                </div>

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        {visibleComments < comments.length && (
          <div className="text-center mt-12" data-aos="fade-up">
            <button
              onClick={loadMore}
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-[#ffd966] to-[#ffb347] px-8 py-3 rounded-full text-[#1a1a2e] font-bold shadow-[0_8px_0_#b94b1f] hover:translate-y-1 hover:shadow-[0_6px_0_#b94b1f] transition-all"
            >
              <span className="relative z-10 flex items-center gap-2">
                KO'PROQ IZOHLAR
                <GiSparkles className="group-hover:rotate-12 transition-transform" />
              </span>
              
            </button>
          </div>
        )}

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-16" data-aos="fade-up" data-aos-delay="200">
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
            <FaStar className="text-[#ffd966]" />
            <span className="text-white text-sm">4.9 ★ Trustpilot</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
            <GiCrown className="text-[#ffb347]" />
            <span className="text-white text-sm">Top 1 Educational Games</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
            <FaRegSmile className="text-[#d42d73]" />
            <span className="text-white text-sm">98% User Satisfaction</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CommentsSection;