import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Gift, Award, Sparkles, Repeat, Frown, RefreshCcw } from 'lucide-react';

const ScratchCard = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [coupon, setCoupon] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isWinningCard, setIsWinningCard] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const width = 300;
  const height = 160;

  // Function to draw the scratch-off layer
  const drawScratchLayer = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Create a more interesting background pattern
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#6366F1');
    gradient.addColorStop(0.5, '#8B5CF6');
    gradient.addColorStop(1, '#EC4899');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add some pattern to the scratch surface
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 10 + 2;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add text with shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch to Win!', width / 2, height / 2 - 10);
    
    // Add an icon hint
    ctx.font = '16px Inter';
    ctx.fillText('👆 Swipe here', width / 2, height / 2 + 20);
  };

  // Redraw the scratch layer and set winning probability when not revealed
  useEffect(() => {
    if (!isRevealed && canvasRef.current) {
      drawScratchLayer();
      setIsWinningCard(Math.random() < 0.2); // 20% chance
    }
  }, [isRevealed]);

  // Calculate the percentage of the card scratched
  const getScratchPercentage = (canvas) => {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, width, height).data;
    let scratchedPixels = 0;
    const totalPixels = width * height;

    for (let i = 0; i < imageData.length; i += 4) {
      if (imageData[i + 3] === 0) {
        scratchedPixels++;
      }
    }

    return (scratchedPixels / totalPixels) * 100;
  };

  // Fetch coupon from backend
  const fetchCoupon = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/extra/makeCoupon`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.status === 200) {
        setCoupon(response.data.message.newCoupon);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch coupon');
      console.error(err);
    }
  };

  // Handle scratching logic with improved scratch effect
  const scratch = (x, y) => {
    if (isRevealed) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    setMousePosition({ x, y });

    // Improved scratch effect with particles
    ctx.globalCompositeOperation = 'destination-out';
    
    // Main scratch circle
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Add sparkle effect around the scratch point
    for (let i = 0; i < 5; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 10 + 15;
      const sparkleX = x + Math.cos(angle) * distance;
      const sparkleY = y + Math.sin(angle) * distance;
      const size = Math.random() * 5 + 2;
      
      ctx.beginPath();
      ctx.arc(sparkleX, sparkleY, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.globalCompositeOperation = 'source-over';

    const percentage = getScratchPercentage(canvas);
    setScratchPercentage(percentage);

    if (percentage >= 60 && !isRevealed) {
      setIsRevealed(true);
      if (isWinningCard) {
        fetchCoupon();
      }
    }
  };

  // Event handlers for mouse and touch
  const getPosition = (e, rect) => {
    return {
      x: e.clientX ? e.clientX - rect.left : e.touches[0].clientX - rect.left,
      y: e.clientY ? e.clientY - rect.top : e.touches[0].clientY - rect.top,
    };
  };

  const handleMouseDown = (e) => {
    if (isRevealed) return;
    setIsScratching(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const { x, y } = getPosition(e, rect);
    scratch(x, y);
  };

  const handleMouseMove = (e) => {
    if (!isScratching || isRevealed) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const { x, y } = getPosition(e, rect);
    scratch(x, y);
  };

  const handleMouseUp = () => {
    setIsScratching(false);
  };

  const handleTouchStart = (e) => {
    if (isRevealed) return;
    setIsScratching(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const { x, y } = getPosition(e, rect);
    scratch(x, y);
    
    // Prevent scrolling when scratching
    e.preventDefault();
  };

  const handleTouchMove = (e) => {
    if (!isScratching || isRevealed) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const { x, y } = getPosition(e, rect);
    scratch(x, y);
    
    // Prevent scrolling when scratching
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    setIsScratching(false);
  };

  // Attach event listeners with { passive: false }
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Add mouse event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    // Add touch event listeners with { passive: false }
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    // Cleanup event listeners on unmount
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isScratching, isRevealed]);

  // Reset the scratch card for a new attempt
  const resetScratchCard = () => {
    setIsRevealed(false);
    setScratchPercentage(0);
    setCoupon(null);
    setError(null);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleHome = () => {
    navigate('/home');
  };

  // Calculate progress bar width (0% to 100% as scratchPercentage goes from 0 to 60)
  const percentageLeft = Math.max(60 - scratchPercentage, 0);
  const progressBarWidth = Math.min((scratchPercentage / 60) * 100, 100);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-indigo-200/20 to-purple-200/20 blur-2xl"
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 30 - 15],
              y: [0, Math.random() * 30 - 15],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: Math.random() * 8 + 7,
            }}
          />
        ))}
      </div>
      
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={350}
          gravity={0.2}
          colors={['#4F46E5', '#9333EA', '#EC4899', '#FCD34D', '#10B981', '#3B82F6']}
        />
      )}

      {/* Scratch effect particles */}
      <AnimatePresence>
        {isScratching && !isRevealed && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-2 h-2 rounded-full bg-white"
                initial={{ 
                  opacity: 1,
                  x: mousePosition.x,
                  y: mousePosition.y,
                  scale: 0.5
                }}
                animate={{ 
                  opacity: 0,
                  x: mousePosition.x + (Math.random() * 60 - 30),
                  y: mousePosition.y + (Math.random() * 60 - 30),
                  scale: 0
                }}
                transition={{ duration: 0.6 }}
                exit={{ opacity: 0 }}
                style={{ left: '50%', top: '50%', marginLeft: '-150px', marginTop: '-80px' }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="absolute top-4 flex justify-between w-full max-w-lg px-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          className="p-2.5 bg-white text-indigo-600 rounded-full shadow-lg hover:shadow-xl hover:bg-indigo-50 transition-all border border-indigo-100"
        >
          <ArrowLeft size={20} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleHome}
          className="p-2.5 bg-white text-purple-600 rounded-full shadow-lg hover:shadow-xl hover:bg-purple-50 transition-all border border-purple-100"
        >
          <Home size={20} />
        </motion.button>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 w-full max-w-md border border-gray-100 relative z-10 mt-16"
      >
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-3 rounded-full shadow-lg"
          >
            <Gift size={28} className="text-white" />
          </motion.div>
        </div>

        <h2 className="text-2xl font-extrabold text-center mt-2 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
          Scratch & Win Rewards
        </h2>

        <div className="relative mx-auto">
          <motion.div
            className="w-[300px] h-[160px] mx-auto bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 flex items-center justify-center shadow-lg border border-gray-100 overflow-hidden"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {isRevealed ? (
                coupon ? (
                  <motion.div
                    key="coupon"
                    initial={{ opacity: 0, scale: 0.7, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center relative"
                  >
                    <motion.div 
                      className="absolute -inset-10 z-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute rounded-full bg-gradient-to-r from-indigo-400/20 to-purple-400/20 z-0"
                          style={{
                            width: `${Math.random() * 20 + 5}px`,
                            height: `${Math.random() * 20 + 5}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                          animate={{
                            y: [0, -20],
                            opacity: [1, 0]
                          }}
                          transition={{
                            duration: Math.random() * 2 + 2,
                            repeat: Infinity,
                            delay: Math.random() * 2
                          }}
                        />
                      ))}
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center justify-center mb-3"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: [0, -5, 0, 5, 0] }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <Award className="text-yellow-500 mr-1" size={20} />
                      <span className="text-lg font-semibold text-green-600">
                        Congratulations!
                      </span>
                    </motion.div>
                    
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-full blur-md transform scale-110" />
                      <p className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-full shadow-md relative">
                        <span className="relative z-10">{coupon.couponCode}</span>
                      </p>
                    </motion.div>
                    
                    <motion.p 
                      className="text-sm text-gray-700 mt-3 font-medium"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-xs shadow-md">
                        <Sparkles size={12} className="mr-1" />
                        {coupon.type === 'percentage'
                          ? `${coupon.discount}% OFF`
                          : `₹${coupon.discount} OFF`}
                      </span>
                    </motion.p>
                    
                    <motion.p 
                      className="text-xs text-gray-500 mt-2"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    >
                      Valid until: {new Date(coupon.expiryDate).toLocaleDateString()}
                    </motion.p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="better-luck"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center"
                  >
                    {/* Replaced the placeholder image with a Lucide icon */}
                    <motion.div
                      className="mx-auto  rounded-full bg-gray-100 w-10 h-10 flex items-center justify-center"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1, rotate: [0, -5, 0, 5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Frown size={30} className="text-gray-400" />
                    </motion.div>
                    
                    <motion.p 
                      className="text-lg font-semibold text-gray-600"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      Better luck next time!
                    </motion.p>
                    <motion.p 
                      className="text-sm text-gray-500 mt-2"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      Don't give up, try again for another chance!
                    </motion.p>
                  </motion.div>
                )
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <motion.p 
                    className="text-gray-500 text-base flex items-center justify-center"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Gift size={16} className="mr-1 text-indigo-400" />
                    Scratch to reveal your prize
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs mt-2 absolute bottom-2 left-0 right-0 text-center bg-red-50 px-2 py-1 rounded"
              >
                {error}
              </motion.p>
            )}
          </motion.div>

          {!isRevealed && (
            <motion.canvas
              ref={canvasRef}
              width={width}
              height={height}
              className="absolute top-0 left-0 right-0 mx-auto rounded-2xl cursor-pointer touch-none"
              initial={{ opacity: 1 }}
              animate={{ 
                opacity: scratchPercentage > 50 ? 0.7 : 1,
                boxShadow: scratchPercentage > 30 ? "0 0 20px rgba(99, 102, 241, 0.3)" : "none"
              }}
              transition={{ duration: 0.3 }}
            />
          )}
        </div>

        <div className="mt-6">
          <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="absolute h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              initial={{ width: '0%' }}
              animate={{ width: `${progressBarWidth}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
          
          <motion.div 
            className="flex items-center justify-center mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isRevealed ? (
              coupon ? (
                <motion.p
                  className="text-xs text-green-600 font-medium px-3 py-1 bg-green-50 rounded-full"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <Sparkles size={12} className="inline mr-1" /> Prize Unlocked!
                </motion.p>
              ) : (
                <motion.p
                  className="text-xs text-gray-600 font-medium px-3 py-1 bg-gray-50 rounded-full"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <RefreshCcw size={12} className="inline mr-1" /> Try Again!
                </motion.p>
              )
            ) : percentageLeft > 0 ? (
              <motion.p
                className="text-xs text-indigo-600 font-medium"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                {Math.round(percentageLeft)}% left to scratch
              </motion.p>
            ) : (
              <motion.p
                className="text-xs text-purple-600 font-medium"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                Revealing...
              </motion.p>
            )}
          </motion.div>
        </div>

        {isRevealed && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={resetScratchCard}
            className="mt-6 w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl shadow-lg transition-all duration-300 font-semibold flex items-center justify-center"
          >
            <RefreshCcw size={16} className="mr-2" />
            Try Again
          </motion.button>
        )}
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-xs text-gray-500 text-center mt-4"
        >
          Scratch to reveal exclusive discount coupons and rewards!
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ScratchCard;