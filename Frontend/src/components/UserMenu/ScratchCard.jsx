/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Gift, Award, Sparkles, Frown, RefreshCcw } from 'lucide-react';

const ScratchCard = () => {
  // Core state management
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [coupon, setCoupon] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isWinningCard, setIsWinningCard] = useState(false);

  // Canvas dimensions
  const width = 300;
  const height = 160;

  // Draw the scratch-off layer
  const drawScratchLayer = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#6366F1');
    gradient.addColorStop(0.5, '#8B5CF6');
    gradient.addColorStop(1, '#EC4899');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add some texture dots
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 10 + 2;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add text instructions
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 5;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch to Win!', width / 2, height / 2 - 10);
    ctx.font = '16px Arial';
    ctx.fillText('👆 Swipe here', width / 2, height / 2 + 20);
  };

  // Initialize the scratch card
  useEffect(() => {
    if (!isRevealed && canvasRef.current) {
      drawScratchLayer();
      setIsWinningCard(Math.random() < 0.2); // 20% chance to win
    }
  }, [isRevealed]);

  // Calculate how much has been scratched
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

  // Fetch coupon from server
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
    }
  };

  // Handle the scratching action
  const scratch = (x, y) => {
    if (isRevealed) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Create the scratch effect
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Add small particles around scratch point
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

    // Calculate current scratch percentage
    const percentage = getScratchPercentage(canvas);
    setScratchPercentage(percentage);

    // Reveal prize if enough scratched (60%)
    if (percentage >= 60 && !isRevealed) {
      setIsRevealed(true);
      if (isWinningCard) {
        fetchCoupon();
      }
    }
  };

  // Helper to get position from mouse/touch events
  const getPosition = (e, rect) => {
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  // Mouse event handlers
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

  // Touch event handlers
  const handleTouchStart = (e) => {
    if (isRevealed) return;
    setIsScratching(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const { x, y } = getPosition(e, rect);
    scratch(x, y);
    e.preventDefault(); // Prevent scrolling
  };

  const handleTouchMove = (e) => {
    if (!isScratching || isRevealed) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const { x, y } = getPosition(e, rect);
    scratch(x, y);
    e.preventDefault(); // Prevent scrolling
  };

  const handleTouchEnd = () => {
    setIsScratching(false);
  };

  // Setup event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isScratching, isRevealed]);

  // Reset for a new attempt
  const resetScratchCard = () => {
    setIsRevealed(false);
    setScratchPercentage(0);
    setCoupon(null);
    setError(null);
  };

  // Navigation handlers
  const handleBack = () => navigate(-1);
  const handleHome = () => navigate('/home');

  // Calculate progress bar width
  const progressBarWidth = Math.min((scratchPercentage / 60) * 100, 100);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      {/* Show confetti on win */}
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

      {/* Navigation buttons */}
      <div className="absolute top-4 flex justify-between w-full max-w-lg px-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          className="p-2.5 bg-white text-indigo-600 rounded-full shadow-lg"
        >
          <ArrowLeft size={20} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleHome}
          className="p-2.5 bg-white text-purple-600 rounded-full shadow-lg"
        >
          <Home size={20} />
        </motion.button>
      </div>

      {/* Main card container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-md mt-16"
      >
        {/* Card header */}
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-3 rounded-full shadow-lg"
          >
            <Gift size={28} className="text-white" />
          </motion.div>
        </div>

        <h2 className="text-2xl font-bold text-center mt-2 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
          Scratch & Win Rewards
        </h2>

        {/* Scratch card area */}
        <div className="relative mx-auto">
          {/* Card background */}
          <motion.div
            className="w-[300px] h-[160px] mx-auto bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 flex items-center justify-center shadow-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {/* Show content based on state */}
            {isRevealed ? (
              coupon ? (
                // Winning result
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center mb-3">
                    <Award className="text-yellow-500 mr-1" size={20} />
                    <span className="text-lg font-semibold text-green-600">
                      Congratulations!
                    </span>
                  </div>
                  
                  <div className="relative">
                    <p className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-full shadow-md">
                      {coupon.couponCode}
                    </p>
                  </div>
                  
                  <p className="text-sm text-gray-700 mt-3 font-medium">
                    <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-xs shadow-md">
                      <Sparkles size={12} className="mr-1" />
                      {coupon.type === 'percentage'
                        ? `${coupon.discount}% OFF`
                        : `₹${coupon.discount} OFF`}
                    </span>
                  </p>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Valid until: {new Date(coupon.expiryDate).toLocaleDateString()}
                  </p>
                </motion.div>
              ) : (
                // Losing result
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <motion.div
                    className="mx-auto rounded-full bg-gray-100 w-10 h-10 flex items-center justify-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <Frown size={30} className="text-gray-400" />
                  </motion.div>
                  
                  <p className="text-lg font-semibold text-gray-600 mt-2">
                    Better luck next time!
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Don&apos;t give up, try again for another chance!
                  </p>
                </motion.div>
              )
            ) : (
              // Initial placeholder before scratching
              <motion.div className="text-center">
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

          {/* The scratch canvas overlay */}
          {!isRevealed && (
            <motion.canvas
              ref={canvasRef}
              width={width}
              height={height}
              className="absolute top-0 left-0 right-0 mx-auto rounded-2xl cursor-pointer touch-none"
              initial={{ opacity: 1 }}
              animate={{ 
                opacity: scratchPercentage > 50 ? 0.7 : 1
              }}
              transition={{ duration: 0.3 }}
            />
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="absolute h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              initial={{ width: '0%' }}
              animate={{ width: `${progressBarWidth}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          {/* Progress status text */}
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
            ) : (
              <motion.p
                className="text-xs text-indigo-600 font-medium"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                {Math.round(60 - scratchPercentage)}% left to scratch
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* Try again button */}
        {isRevealed && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetScratchCard}
            className="mt-6 w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl shadow-lg font-semibold flex items-center justify-center"
          >
            <RefreshCcw size={16} className="mr-2" />
            Try Again
          </motion.button>
        )}
        
        {/* Footer hint */}
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