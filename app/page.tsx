"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  ChevronDown,
  BookOpen,
  Lightbulb,
  Users,
  Factory,
  GraduationCap,
  Sprout,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Briefcase,
  BookOpenCheck,
  Heart,
  Star,
  Zap,
} from "lucide-react"

const sections = [
  { id: "section-0", title: "Mở đầu", icon: BookOpen },
  { id: "section-1", title: "Nông dân", icon: Sprout },
  { id: "section-2", title: "Công nhân", icon: Factory },
  { id: "section-3", title: "Trí thức", icon: GraduationCap },
  { id: "section-4", title: "Liên minh", icon: Users },
  { id: "section-5", title: "Hiện tại", icon: Lightbulb },
  { id: "section-6", title: "Tương tác", icon: Users },
]

export default function VietnameseStorytellingPage() {
  const [activeSection, setActiveSection] = useState(0)
  const [quizResult, setQuizResult] = useState("")
  const [showQuizResult, setShowQuizResult] = useState(false)
  const [showMobileNav, setShowMobileNav] = useState(false)
  const isScrollingRef = useRef(false)
  const snapTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastScrollTimeRef = useRef(0)
  const scrollDirectionRef = useRef<"up" | "down" | null>(null)
  const lastScrollYRef = useRef(0)

  const updateActiveSection = useCallback(() => {
    if (isScrollingRef.current) return

    const scrollY = window.scrollY
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    if (scrollY + windowHeight >= documentHeight - 50) {
      setActiveSection(sections.length - 1)
      return
    }

    // Find which section is currently in view
    for (let i = 0; i < sections.length; i++) {
      const element = document.getElementById(sections[i].id)
      if (element) {
        const rect = element.getBoundingClientRect()
        const elementTop = rect.top + scrollY
        const elementBottom = elementTop + rect.height

        // Check if the middle of the viewport is within this section
        const viewportMiddle = scrollY + windowHeight / 2

        if (viewportMiddle >= elementTop && viewportMiddle < elementBottom) {
          if (activeSection !== i) {
            setActiveSection(i)
          }
          break
        }
      }
    }
  }, [activeSection])

  const handleSnapScrolling = useCallback(() => {
    const currentScrollY = window.scrollY
    const currentTime = Date.now()

    // Determine scroll direction
    if (currentScrollY > lastScrollYRef.current) {
      scrollDirectionRef.current = "down"
    } else if (currentScrollY < lastScrollYRef.current) {
      scrollDirectionRef.current = "up"
    }

    lastScrollYRef.current = currentScrollY
    lastScrollTimeRef.current = currentTime

    // Clear existing timeout
    if (snapTimeoutRef.current) {
      clearTimeout(snapTimeoutRef.current)
    }

    // Set new timeout for snap scrolling
    snapTimeoutRef.current = setTimeout(() => {
      if (isScrollingRef.current) return

      const timeSinceLastScroll = Date.now() - lastScrollTimeRef.current
      if (timeSinceLastScroll < 150) return // Still scrolling, don't snap yet

      // Find the closest section to snap to
      const windowHeight = window.innerHeight
      const scrollY = window.scrollY
      let closestSection = 0
      let minDistance = Number.POSITIVE_INFINITY

      for (let i = 0; i < sections.length; i++) {
        const element = document.getElementById(sections[i].id)
        if (element) {
          const rect = element.getBoundingClientRect()
          const elementTop = rect.top + scrollY
          const distance = Math.abs(elementTop - scrollY)

          if (distance < minDistance) {
            minDistance = distance
            closestSection = i
          }
        }
      }

      // Check if we need to snap (if we're not already at the top of a section)
      const currentElement = document.getElementById(sections[closestSection].id)
      if (currentElement) {
        const rect = currentElement.getBoundingClientRect()
        const elementTop = rect.top + scrollY
        const threshold = windowHeight * 0.3 // 30% of viewport height

        // If we're more than threshold away from section top, snap to it
        if (Math.abs(elementTop - scrollY) > threshold) {
          // Determine which section to snap to based on scroll direction and position
          let targetSection = closestSection

          if (scrollDirectionRef.current === "down" && rect.top < -threshold) {
            // Scrolling down and past threshold, go to next section
            targetSection = Math.min(closestSection + 1, sections.length - 1)
          } else if (scrollDirectionRef.current === "up" && rect.top > threshold) {
            // Scrolling up and past threshold, go to previous section
            targetSection = Math.max(closestSection - 1, 0)
          }

          // Smooth scroll to target section
          scrollToSection(targetSection)
        }
      }
    }, 150) // Wait 150ms after scroll stops
  }, [])

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveSection()
          handleSnapScrolling()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    // Initial call to set correct section
    updateActiveSection()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current)
      }
    }
  }, [updateActiveSection, handleSnapScrolling])

  const scrollToSection = useCallback((sectionIndex: number) => {
    const sectionId = sections[sectionIndex].id
    const element = document.getElementById(sectionId)

    if (element) {
      isScrollingRef.current = true
      setActiveSection(sectionIndex)

      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })

      setShowMobileNav(false)

      setTimeout(() => {
        isScrollingRef.current = false
      }, 1500)
    }
  }, [])

  const goToNextSection = useCallback(() => {
    const nextIndex = activeSection >= sections.length - 1 ? 0 : activeSection + 1
    scrollToSection(nextIndex)
  }, [activeSection, scrollToSection])

  const goToPreviousSection = useCallback(() => {
    const prevIndex = activeSection <= 0 ? sections.length - 1 : activeSection - 1
    scrollToSection(prevIndex)
  }, [activeSection, scrollToSection])

  const handleQuizAnswer = (answer: string) => {
    const results = {
      "nong-dan": "Bạn giữ vai trò gốc rễ của xã hội, bảo đảm an ninh lương thực, góp phần phát triển nông thôn.",
      "cong-nhan":
        "Bạn là một phần quan trọng của giai cấp tiên phong, trực tiếp tạo ra sản phẩm vật chất và dịch vụ cho xã hội.",
      "tri-thuc": "Bạn góp phần đưa tri thức và công nghệ vào sản xuất, xây dựng tương lai đất nước.",
      "doanh-nhan": "Bạn thúc đẩy sản xuất, tạo việc làm, góp phần gắn kinh tế thị trường với định hướng XHCN.",
      "sinh-vien": "Bạn là lực lượng kế thừa, trí thức trẻ tương lai của đất nước.",
    }
    setQuizResult(results[answer as keyof typeof results] || "Cảm ơn bạn đã tham gia!")
    setShowQuizResult(true)
  }

  const quizOptions = [
    {
      id: "nong-dan",
      label: "Nông dân",
      icon: Sprout,
      color: "bg-green-500",
      description: "Làm việc trong nông nghiệp, chăn nuôi",
    },
    {
      id: "cong-nhan",
      label: "Công nhân",
      icon: Factory,
      color: "bg-blue-500",
      description: "Làm việc trong công nghiệp, sản xuất",
    },
    {
      id: "tri-thuc",
      label: "Trí thức",
      icon: GraduationCap,
      color: "bg-purple-500",
      description: "Kỹ sư, bác sĩ, giáo viên, nghiên cứu",
    },
    {
      id: "doanh-nhan",
      label: "Doanh nhân",
      icon: Briefcase,
      color: "bg-orange-500",
      description: "Kinh doanh, khởi nghiệp",
    },
    {
      id: "sinh-vien",
      label: "Sinh viên",
      icon: BookOpenCheck,
      color: "bg-pink-500",
      description: "Đang học tập, nghiên cứu",
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="font-bold text-xl text-primary">Hành trình đổi mới</div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {sections.map((section, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(index)}
                className={`text-sm transition-colors flex items-center space-x-1 px-3 py-2 rounded-lg ${
                  activeSection === index
                    ? "text-primary-foreground bg-primary font-semibold"
                    : "text-foreground hover:text-primary hover:bg-muted"
                }`}
              >
                <section.icon className="h-4 w-4" />
                <span>{section.title}</span>
              </button>
            ))}
          </div>

          {/* Mobile Navigation Toggle */}
          <button className="md:hidden p-2" onClick={() => setShowMobileNav(!showMobileNav)}>
            {showMobileNav ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileNav && (
          <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {sections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex items-center space-x-3 ${
                    activeSection === index ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <section.icon className="h-5 w-5" />
                  <span>{section.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
        <div className="bg-background/95 backdrop-blur-md border border-border rounded-lg p-2 space-y-2 shadow-lg">
          {sections.map((section, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(index)}
              className={`w-12 h-12 rounded-lg transition-all duration-300 flex items-center justify-center group relative ${
                activeSection === index
                  ? "bg-primary text-primary-foreground shadow-lg scale-110"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground hover:scale-105"
              }`}
              title={section.title}
            >
              <section.icon className="h-5 w-5" />
              {/* Tooltip */}
              <div className="absolute right-full mr-3 px-3 py-2 bg-foreground text-background text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {section.title}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-background/95 backdrop-blur-md border border-border rounded-full px-6 py-3 flex items-center space-x-4 shadow-lg">
          <Button variant="ghost" size="sm" onClick={goToPreviousSection} className="rounded-full hover:bg-muted">
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center space-x-2 min-w-[60px] justify-center">
            <span className="text-sm font-medium">{activeSection + 1}</span>
            <span className="text-xs text-muted-foreground">/</span>
            <span className="text-xs text-muted-foreground">{sections.length}</span>
          </div>

          <Button variant="ghost" size="sm" onClick={goToNextSection} className="rounded-full hover:bg-muted">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${((activeSection + 1) / sections.length) * 100}%` }}
        />
      </div>

      {/* Section 1: Landing Page */}
      <section
        id="section-0"
        className="story-section min-h-screen flex items-center justify-center relative overflow-hidden"
      >
        <div
          className="absolute inset-0 parallax-bg"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/vietnamese-countryside-transitioning-to-modern-cit.jpg')`,
          }}
        />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="font-bold text-5xl md:text-7xl mb-6 animate-fade-in-up text-balance">Hành trình đổi mới</h1>
          <h2 className="text-2xl md:text-3xl mb-8 animate-fade-in-up text-balance" style={{ animationDelay: "0.2s" }}>
            Hành trình giai cấp trong thời kỳ quá độ lên CNXH ở Việt Nam
          </h2>
          <p
            className="text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up text-pretty"
            style={{ animationDelay: "0.4s" }}
          >
            Theo chân nhân vật Nam – từ một người nông dân nghèo, bước vào hành trình công nghiệp hóa, trở thành công
            nhân, rồi trí thức kỹ sư. Câu chuyện gợi mở sự biến đổi giai cấp, sự hình thành liên minh công – nông – trí
            thức trong xây dựng đất nước.
          </p>
          <Button
            size="lg"
            className="animate-fade-in-up bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
            style={{ animationDelay: "0.6s" }}
            onClick={() => scrollToSection(1)}
          >
            Bắt đầu hành trình
            <ChevronDown className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Section 2: Nông dân */}
      <section id="section-1" className="story-section min-h-screen flex items-center py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <img
                src="/vietnamese-farmer-working-in-rice-fields-tradition.jpg"
                alt="Nông dân Việt Nam"
                className="rounded-lg shadow-2xl w-full"
              />
            </div>
            <div className="animate-slide-in-right space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <Sprout className="h-8 w-8 text-primary" />
                <h2 className="font-bold text-4xl mb-2 text-primary">Chương 1: Nông dân</h2>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <p className="text-lg leading-relaxed mb-4 text-pretty">
                  "Tôi tên Nam, sinh ra trong một gia đình thuần nông. Cha mẹ quanh năm 'bán mặt cho đất, bán lưng cho
                  trời'. Cuộc sống còn nhiều khó khăn, thiếu thốn, cơ hội học hành ít ỏi. Tôi từng nghĩ mình sẽ gắn cả
                  đời với ruộng đồng."
                </p>
                <div className="flex flex-wrap gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Tìm hiểu thêm
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-3">
                          <Sprout className="h-8 w-8" />
                          Giai cấp nông dân trong CNXH Việt Nam
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <img
                              src="/vietnamese-farmer-working-in-rice-fields-tradition.jpg"
                              alt="Nông dân truyền thống"
                              className="rounded-lg w-full mb-4"
                            />
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                              <Heart className="h-5 w-5 text-red-500" />
                              Vai trò quan trọng
                            </h3>
                            <p className="text-muted-foreground">
                              Nông dân là giai cấp đông đảo nhất trong cơ cấu xã hội Việt Nam thời kỳ đầu quá độ, giữ
                              vai trò nền tảng trong sản xuất lương thực.
                            </p>
                          </div>
                          <div>
                            <img
                              src="/vietnamese-high-tech-agriculture-smart-farming-tec.jpg"
                              alt="Nông nghiệp hiện đại"
                              className="rounded-lg w-full mb-4"
                            />
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                              <Zap className="h-5 w-5 text-yellow-500" />
                              Đặc trưng giai cấp
                            </h3>
                            <p className="text-muted-foreground">
                              Sản xuất nhỏ, dễ bị phân hóa giai cấp, nhưng có tiềm năng phát triển mạnh mẽ khi được hỗ
                              trợ công nghệ.
                            </p>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-l-4 border-primary">
                          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500" />
                            Vị trí trong liên minh
                          </h3>
                          <p className="text-lg">
                            Đảng xác định: giai cấp nông dân là lực lượng quan trọng trong liên minh công – nông – trí
                            thức, góp phần xây dựng nền tảng vững chắc cho xã hội chủ nghĩa.
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Công nhân */}
      <section id="section-2" className="story-section min-h-screen flex items-center py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left space-y-6 order-2 md:order-1">
              <div className="flex items-center space-x-3 mb-4">
                <Factory className="h-8 w-8 text-primary" />
                <h2 className="font-bold text-4xl mb-2 text-primary">Chương 2: Công nhân</h2>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <p className="text-lg leading-relaxed mb-4 text-pretty">
                  "Khi khu công nghiệp mọc lên gần quê, tôi quyết định rời ruộng đồng. Tôi trở thành công nhân trong nhà
                  máy điện tử. Ban đầu bỡ ngỡ, nhưng dần tôi nhận ra: đây là một thế giới khác – kỷ luật, máy móc, tập
                  thể đoàn kết."
                </p>
                <div className="flex flex-wrap gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Tìm hiểu thêm
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-3">
                          <Factory className="h-8 w-8" />
                          Giai cấp công nhân - Lực lượng tiên phong
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <img
                              src="/vietnamese-factory-workers-in-modern-industrial-se.jpg"
                              alt="Công nhân hiện đại"
                              className="rounded-lg w-full mb-4"
                            />
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                              <Star className="h-5 w-5 text-blue-500" />
                              Vai trò lãnh đạo
                            </h3>
                            <p className="text-muted-foreground">
                              Giai cấp công nhân là lực lượng tiên phong, lãnh đạo cách mạng trong thời kỳ xây dựng chủ
                              nghĩa xã hội.
                            </p>
                          </div>
                          <div>
                            <img
                              src="/modern-vietnamese-factory-workers-advanced-manufac.jpg"
                              alt="Công nghệ hiện đại"
                              className="rounded-lg w-full mb-4"
                            />
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                              <Zap className="h-5 w-5 text-yellow-500" />
                              Phát triển toàn diện
                            </h3>
                            <p className="text-muted-foreground">
                              Trong thời kỳ quá độ lên CNXH, công nhân phát triển cả về số lượng và chất lượng, làm chủ
                              công nghệ hiện đại.
                            </p>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-l-4 border-blue-500">
                          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <Heart className="h-5 w-5 text-red-500" />
                            Nền tảng sản xuất
                          </h3>
                          <p className="text-lg">
                            Công nhân là cơ sở cho nền sản xuất hiện đại, trực tiếp tạo ra của cải vật chất, thúc đẩy
                            công nghiệp hóa, hiện đại hóa đất nước.
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
            <div className="animate-slide-in-right order-1 md:order-2">
              <img
                src="/vietnamese-factory-workers-in-modern-industrial-se.jpg"
                alt="Công nhân Việt Nam"
                className="rounded-lg shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Trí thức */}
      <section id="section-3" className="story-section min-h-screen flex items-center py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <img
                src="/vietnamese-engineer-in-modern-laboratory-technolog.jpg"
                alt="Trí thức Việt Nam"
                className="rounded-lg shadow-2xl w-full"
              />
            </div>
            <div className="animate-slide-in-right space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <GraduationCap className="h-8 w-8 text-primary" />
                <h2 className="font-bold text-4xl mb-2 text-primary">Chương 3: Trí thức</h2>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <p className="text-lg leading-relaxed mb-4 text-pretty">
                  "Nhờ sự hỗ trợ đào tạo từ công ty, tôi có cơ hội học thêm. Vài năm sau, tôi trở thành kỹ sư, phụ trách
                  dây chuyền công nghệ cao. Từ một nông dân, giờ tôi đã là một phần của đội ngũ trí thức – góp sức
                  nghiên cứu, sáng tạo cho đất nước."
                </p>
                <div className="flex flex-wrap gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Tìm hiểu thêm
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-3">
                          <GraduationCap className="h-8 w-8" />
                          Vai trò của trí thức trong CNXH
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <img
                              src="/vietnamese-engineer-in-modern-laboratory-technolog.jpg"
                              alt="Kỹ sư nghiên cứu"
                              className="rounded-lg w-full mb-4"
                            />
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                              <Lightbulb className="h-5 w-5 text-purple-500" />
                              Vai trò then chốt
                            </h3>
                            <p className="text-muted-foreground">
                              Trí thức giữ vai trò then chốt trong công nghiệp hóa, hiện đại hóa, là cầu nối đưa tri
                              thức vào sản xuất.
                            </p>
                          </div>
                          <div>
                            <img
                              src="/young-vietnamese-entrepreneurs-startup-innovation-.jpg"
                              alt="Trí thức trẻ"
                              className="rounded-lg w-full mb-4"
                            />
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                              <Star className="h-5 w-5 text-yellow-500" />
                              Đổi mới sáng tạo
                            </h3>
                            <p className="text-muted-foreground">
                              Trí thức góp phần đưa tri thức, công nghệ vào sản xuất, nâng cao năng suất lao động và
                              chất lượng cuộc sống.
                            </p>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-l-4 border-purple-500">
                          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <Heart className="h-5 w-5 text-red-500" />
                            Liên minh vững chắc
                          </h3>
                          <p className="text-lg">
                            Liên minh công – nông – trí thức dưới sự lãnh đạo của Đảng là nền tảng khối đại đoàn kết dân
                            tộc, tạo sức mạnh tổng hợp cho sự nghiệp xây dựng CNXH.
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Liên minh giai cấp */}
      <section id="section-4" className="story-section min-h-screen flex items-center py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Users className="h-10 w-10 text-primary" />
              <h2 className="font-bold text-4xl mb-2 text-primary">Chương 4: Liên minh giai cấp</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <div className="bg-card p-8 rounded-lg border border-border">
                <p className="text-lg leading-relaxed mb-6 text-pretty">
                  "Nhìn lại hành trình của mình, tôi hiểu rằng: không có sự phát triển nào là đơn lẻ. Đất nước chỉ tiến
                  lên khi công nhân, nông dân và trí thức cùng bắt tay nhau, dưới sự lãnh đạo của Đảng. Đó là khối liên
                  minh vững chắc, nền tảng của CNXH Việt Nam."
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Tìm hiểu thêm
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-3">
                        <Users className="h-8 w-8" />
                        Liên minh công - nông - trí thức
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <Factory className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                          <h3 className="font-bold text-lg mb-2">Công nhân</h3>
                          <p className="text-sm text-muted-foreground">Lực lượng tiên phong, lãnh đạo</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <Sprout className="h-12 w-12 text-green-500 mx-auto mb-3" />
                          <h3 className="font-bold text-lg mb-2">Nông dân</h3>
                          <p className="text-sm text-muted-foreground">Lực lượng đông đảo, nền tảng</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <GraduationCap className="h-12 w-12 text-purple-500 mx-auto mb-3" />
                          <h3 className="font-bold text-lg mb-2">Trí thức</h3>
                          <p className="text-sm text-muted-foreground">Tri thức, công nghệ</p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-red-50 to-yellow-50 p-6 rounded-lg border-l-4 border-red-500">
                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                          <Heart className="h-5 w-5 text-red-500" />Ý nghĩa liên minh
                        </h3>
                        <ul className="space-y-2 text-muted-foreground">
                          <li>
                            • <strong>Tính kinh tế:</strong> Bổ sung, hỗ trợ nhau trong sản xuất và phát triển
                          </li>
                          <li>
                            • <strong>Tính chính trị:</strong> Tạo cơ sở chính trị vững chắc, đảm bảo đại đoàn kết
                          </li>
                          <li>
                            • <strong>Tính chiến lược:</strong> Nguyên tắc lâu dài của cách mạng XHCN Việt Nam
                          </li>
                        </ul>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="animate-slide-in-right">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-lg border border-border">
                <div className="text-center space-y-6">
                  <div className="flex justify-center items-center space-x-4">
                    <div className="bg-primary text-primary-foreground p-4 rounded-full">
                      <Factory className="h-6 w-6" />
                    </div>
                    <span className="text-2xl font-bold">+</span>
                    <div className="bg-secondary text-secondary-foreground p-4 rounded-full">
                      <Sprout className="h-6 w-6" />
                    </div>
                    <span className="text-2xl font-bold">+</span>
                    <div className="bg-accent text-accent-foreground p-4 rounded-full">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">↓</div>
                  <div className="bg-primary text-primary-foreground p-4 rounded-lg">
                    <h3 className="font-bold text-lg">Liên minh giai cấp</h3>
                  </div>
                  <div className="text-2xl font-bold">↓</div>
                  <div className="bg-secondary text-secondary-foreground p-4 rounded-lg">
                    <h3 className="font-bold">Nền tảng khối đại đoàn kết dân tộc</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Thực tiễn hôm nay */}
      <section id="section-5" className="story-section min-h-screen flex items-center py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 parallax-bg opacity-20"
          style={{
            backgroundImage: `url('/modern-vietnam-cityscape-with-technology-parks-and.jpg')`,
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-bold text-4xl mb-6 text-primary">Chương 5: Thực tiễn hôm nay</h2>
            <p className="text-xl leading-relaxed max-w-4xl mx-auto text-pretty">
              "Câu chuyện của tôi không chỉ là cá nhân, mà là hành trình của hàng triệu người Việt Nam trong công cuộc
              đổi mới. Người nông dân hôm nay áp dụng nông nghiệp công nghệ cao. Người công nhân làm việc trong các nhà
              máy hiện đại. Người trí thức trẻ khởi nghiệp sáng tạo, đóng góp vào khoa học – công nghệ. Tất cả đang góp
              phần đưa Việt Nam đi lên con đường CNXH."
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="animate-fade-in-up">
              <CardContent className="p-6 text-center">
                <img
                  src="/vietnamese-high-tech-agriculture-smart-farming-tec.jpg"
                  alt="Nông nghiệp công nghệ cao"
                  className="rounded-lg mb-4 w-full"
                />
                <h3 className="font-bold text-lg mb-2">Nông nghiệp công nghệ cao</h3>
                <p className="text-muted-foreground">Ứng dụng công nghệ hiện đại trong sản xuất nông nghiệp</p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <CardContent className="p-6 text-center">
                <img
                  src="/modern-vietnamese-factory-workers-advanced-manufac.jpg"
                  alt="Công nhân hiện đại"
                  className="rounded-lg mb-4 w-full"
                />
                <h3 className="font-bold text-lg mb-2">Công nhân hiện đại</h3>
                <p className="text-muted-foreground">Lao động trong các nhà máy công nghệ cao</p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <CardContent className="p-6 text-center">
                <img
                  src="/young-vietnamese-entrepreneurs-startup-innovation-.jpg"
                  alt="Trí thức khởi nghiệp"
                  className="rounded-lg mb-4 w-full"
                />
                <h3 className="font-bold text-lg mb-2">Trí thức khởi nghiệp</h3>
                <p className="text-muted-foreground">Đổi mới sáng tạo trong khoa học công nghệ</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 7: Interactive Quiz */}
      <section
        id="section-6"
        className="story-section min-h-screen flex items-center py-20 bg-gradient-to-br from-primary/5 to-secondary/5"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-4xl mb-6 text-primary">Bạn thuộc giai cấp/tầng lớp nào hiện nay?</h2>
            <p className="text-xl text-muted-foreground">Khám phá vai trò của bạn trong xã hội Việt Nam hiện đại</p>
          </div>

          <div className="grid md:grid-cols-5 gap-4 max-w-5xl mx-auto mb-12">
            {quizOptions.map((option) => (
              <Card
                key={option.id}
                className={`cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 group ${option.color}`}
                onClick={() => handleQuizAnswer(option.id)}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`text-white p-4 rounded-full inline-block mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <option.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{option.label}</h3>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {showQuizResult && (
            <div className="max-w-2xl mx-auto animate-fade-in-up">
              <Card className="bg-primary/10 border-primary">
                <CardContent className="p-8 text-center">
                  <h3 className="font-bold text-xl mb-4 text-primary">Kết quả của bạn</h3>
                  <p className="text-lg leading-relaxed mb-6 text-pretty">{quizResult}</p>
                  <div className="bg-secondary/20 p-6 rounded-lg">
                    <p className="font-semibold text-lg text-balance">
                      "Mỗi người Việt Nam đều là một phần của hành trình. Dù bạn là nông dân, công nhân, trí thức hay
                      doanh nhân – tất cả cùng chung tay xây dựng Tổ quốc đi lên CNXH."
                    </p>
                  </div>
                  <Button variant="outline" className="mt-4 bg-transparent" onClick={() => setShowQuizResult(false)}>
                    Thử lại
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-bold text-2xl mb-4">Hành trình đổi mới</h3>
          <p className="text-lg mb-6 max-w-2xl mx-auto text-pretty">
            Câu chuyện về sự biến đổi giai cấp trong thời kỳ quá độ lên Chủ nghĩa xã hội ở Việt Nam
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <span>© 2025 Hành trình đổi mới</span>
            <span>•</span>
            <span>Giáo dục và Truyền thông</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
