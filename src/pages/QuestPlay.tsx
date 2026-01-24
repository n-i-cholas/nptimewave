import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuests, useUserProgress, useAchievements } from '@/hooks/useGameData';
import { Heart, Lightbulb, CheckCircle2, XCircle, ArrowRight, Trophy, Sparkles, LogIn, RotateCcw } from 'lucide-react';
import { soundManager } from '@/lib/sounds';
import { celebrateQuestComplete } from '@/lib/confetti';

const QuestPlay = () => {
  const { questId } = useParams<{ questId: string }>();
  const [searchParams] = useSearchParams();
  const isPracticeMode = searchParams.get('mode') === 'practice';
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const { quests, loading: questsLoading } = useQuests();
  const { addPoints, loseLife, recordCorrectAnswer, completeQuest, updateStreak, getCompletedQuests } = useUserProgress();
  const { unlockAchievement } = useAchievements();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showFunFact, setShowFunFact] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [showStreakBonus, setShowStreakBonus] = useState(false);
  const [completedQuests, setCompletedQuests] = useState<(string | null)[]>([]);

  const quest = quests.find((q) => q.id === questId);
  const lives = profile?.lives ?? 5; // Default to 5 while profile loads
  const profileLoaded = profile !== null;

  useEffect(() => {
    if (user) {
      updateStreak();
      getCompletedQuests().then(setCompletedQuests);
    }
  }, [user]);

  // In practice mode, don't check lives - only check after profile is loaded
  useEffect(() => {
    if (profileLoaded && lives === 0 && !questsLoading && user && !isPracticeMode) {
      setGameOver(true);
    }
  }, [lives, questsLoading, user, isPracticeMode, profileLoaded]);

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-background">
        <div className="text-center animate-fade-in max-w-md mx-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">
            Sign In to Play
          </h2>
          <p className="text-muted-foreground mb-6">
            Create an account or sign in to track your progress and earn rewards!
          </p>
          <button onClick={() => navigate('/auth')} className="np-button-primary">
            Sign In / Sign Up
          </button>
        </div>
      </div>
    );
  }

  if (questsLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-background">
        <div className="text-center animate-fade-in">
          <p className="text-foreground text-xl mb-4">Quest not found</p>
          <button onClick={() => navigate('/quests')} className="np-button-primary">
            Back to Quests
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quest.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quest.questions.length - 1;
  const isQuestCompleted = completedQuests.includes(quest.id);
  const progress = ((currentQuestionIndex + 1) / quest.questions.length) * 100;

  const handleAnswerSelect = async (answerIndex: number) => {
    if (selectedAnswer !== null || gameOver) return;

    setSelectedAnswer(answerIndex);
    const correct = answerIndex === currentQuestion.correct_answer;
    setIsCorrect(correct);

    if (correct) {
      soundManager.playCorrect();
      if (!isPracticeMode) {
        await recordCorrectAnswer();
      }
      const basePoints = currentQuestion.points || 100;
      const newStreak = correctStreak + 1;
      setCorrectStreak(newStreak);
      
      // Streak bonus (only in normal mode)
      let bonus = 0;
      if (newStreak >= 3 && !isPracticeMode) {
        bonus = 50;
        setShowStreakBonus(true);
        setTimeout(() => setShowStreakBonus(false), 1500);
      }
      
      setScore((prev) => prev + basePoints + bonus);
    } else {
      soundManager.playWrong();
      setCorrectStreak(0);
      if (!isPracticeMode) {
        await loseLife();
        await refreshProfile();
        
        // Check if out of lives
        if ((profile?.lives || 1) - 1 === 0) {
          setGameOver(true);
        }
      }
    }

    setTimeout(() => {
      setShowResult(true);
      if (currentQuestion.fun_fact) {
        setTimeout(() => setShowFunFact(true), 500);
      }
    }, 600);
  };

  const handleNext = async () => {
    if (isLastQuestion) {
      if (!isPracticeMode) {
        await addPoints(score);
        if (!isQuestCompleted) {
          await completeQuest(quest.id);
          soundManager.playQuestComplete();
          celebrateQuestComplete();
          
          // Check for achievements
          const updatedCompleted = await getCompletedQuests();
          if (updatedCompleted.length >= 1) {
            await unlockAchievement('history-explorer');
          }
          if (updatedCompleted.length >= 3) {
            await unlockAchievement('campus-expert');
          }
        }
        await refreshProfile();
      }
      setTimeout(() => navigate('/quests'), 1500);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowResult(false);
      setShowFunFact(false);
    }
  };

  const handleExit = async () => {
    if (score > 0 && !isPracticeMode) {
      await addPoints(score);
      await refreshProfile();
    }
    navigate('/quests');
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="py-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleExit}
              className="px-4 py-2 bg-secondary text-foreground rounded-xl font-medium hover:bg-secondary/80 transition-all border border-border"
            >
              Exit
            </button>
            
            <div className="flex items-center gap-3">
              {isPracticeMode && (
                <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  <RotateCcw className="w-4 h-4" />
                  Practice
                </div>
              )}
              <span className="text-2xl">{quest.icon}</span>
              <h2 className="font-display text-lg font-bold text-foreground hidden sm:block">
                {quest.category}
              </h2>
            </div>
            
            {/* Lives - hide in practice mode */}
            {!isPracticeMode ? (
              <div className="flex items-center gap-1">
                {Array.from({ length: profile?.max_lives || 5 }).map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-6 h-6 transition-all duration-300 ${
                      i < lives ? 'fill-destructive text-destructive' : 'text-muted-foreground'
                    } ${i === lives - 1 && lives <= 1 ? 'animate-pulse' : ''}`}
                  />
                ))}
              </div>
            ) : (
              <div className="w-24" /> /* Spacer for layout balance */
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="np-progress-bar h-3">
              <div 
                className="np-progress-fill transition-all duration-500" 
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Question {currentQuestionIndex + 1} of {quest.questions.length}</span>
            <span className="text-primary font-medium">
              {isPracticeMode ? 'Practice Mode' : `Score: ${score}`}
            </span>
          </div>
        </div>

        {gameOver ? (
          /* Game Over Screen */
          <div className="text-center py-16 animate-fade-in">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-destructive" />
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              No Lives Left!
            </h2>
            <p className="text-muted-foreground mb-2">
              Your lives will reset tomorrow.
            </p>
            <p className="text-primary font-bold text-xl mb-8">
              You earned {score} points!
            </p>
            <button onClick={handleExit} className="np-button-primary">
              Return to Quests
            </button>
          </div>
        ) : (
          /* Question Content */
          <div className="animate-fade-in">
            {/* Streak Bonus Notification */}
            {showStreakBonus && (
              <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg">
                  <Sparkles className="w-5 h-5" />
                  Streak Bonus! +50
                </div>
              </div>
            )}

            {/* Question */}
            <div className="np-card p-6 mb-8">
              <h3 className="font-display text-xl md:text-2xl font-bold text-foreground leading-relaxed">
                {currentQuestion.question}
              </h3>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {currentQuestion.options.map((option, index) => {
                let stateClasses = 'bg-card text-foreground hover:scale-[1.02] hover:shadow-lg hover:border-primary/50';
                let icon = null;
                
                if (selectedAnswer !== null) {
                  if (index === currentQuestion.correct_answer) {
                    stateClasses = 'bg-success text-white scale-[1.02] shadow-lg shadow-success/30 border-success';
                    icon = <CheckCircle2 className="w-6 h-6" />;
                  } else if (index === selectedAnswer && !isCorrect) {
                    stateClasses = 'bg-destructive text-white animate-shake border-destructive';
                    icon = <XCircle className="w-6 h-6" />;
                  } else {
                    stateClasses = 'bg-muted/50 text-muted-foreground border-border';
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                    className={`np-answer-option ${stateClasses} flex items-center justify-between transition-all duration-300`}
                  >
                    <span>{option}</span>
                    {icon}
                  </button>
                );
              })}
            </div>

            {/* Result and Fun Fact */}
            {showResult && (
              <div className="space-y-4 animate-slide-up">
                {/* Result Message */}
                <div className={`p-4 rounded-xl text-center ${
                  isCorrect 
                    ? 'bg-success/10 border border-success/30' 
                    : 'bg-destructive/10 border border-destructive/30'
                }`}>
                  <p className={`text-xl font-bold ${isCorrect ? 'text-success' : 'text-destructive'}`}>
                    {isCorrect ? (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-6 h-6" />
                        Correct! +{(currentQuestion.points || 100) + (correctStreak >= 3 ? 50 : 0)} points
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <XCircle className="w-6 h-6" />
                        Wrong answer! -1 Life
                      </span>
                    )}
                  </p>
                </div>

                {/* Fun Fact */}
                {showFunFact && currentQuestion.fun_fact && (
                  <div className="np-card p-5 bg-primary/5 border-primary/20 animate-fade-in-up">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary mb-1">Did you know?</p>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {currentQuestion.fun_fact}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  className="w-full np-button-primary py-4 flex items-center justify-center gap-2"
                >
                  {isLastQuestion ? (
                    <>
                      <Trophy className="w-5 h-5" />
                      Complete Quest
                    </>
                  ) : (
                    <>
                      Next Question
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Streak Indicator */}
            {correctStreak >= 2 && !showResult && (
              <div className="text-center mt-4 animate-pulse">
                <span className="text-orange-500 font-medium">
                  🔥 {correctStreak} correct in a row! {correctStreak >= 2 && 'One more for bonus!'}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestPlay;
