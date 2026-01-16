import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore, quests } from '@/store/gameStore';
import { Heart, ArrowLeft, X } from 'lucide-react';

const QuestPlay = () => {
  const { questId } = useParams<{ questId: string }>();
  const navigate = useNavigate();
  const { lives, addPoints, loseLife, completeQuest, completedQuests } = useGameStore();
  
  const quest = quests.find((q) => q.id === questId);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (lives === 0) {
      setGameOver(true);
    }
  }, [lives]);

  if (!quest) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-foreground">Quest not found</p>
      </div>
    );
  }

  const currentQuestion = quest.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quest.questions.length - 1;
  const isQuestCompleted = completedQuests.includes(quest.id);

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || gameOver) return;

    setSelectedAnswer(answerIndex);
    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 100);
    } else {
      loseLife();
    }

    setTimeout(() => {
      setShowResult(true);
    }, 500);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Quest completed
      addPoints(score);
      if (!isQuestCompleted) {
        completeQuest(quest.id);
      }
      navigate('/quests');
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowResult(false);
    }
  };

  const handleExit = () => {
    if (score > 0) {
      addPoints(score);
    }
    navigate('/quests');
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="py-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleExit}
              className="flex items-center gap-2 text-primary font-medium px-4 py-2 bg-np-cyan-light text-np-navy rounded-full"
            >
              Exit
            </button>
            <h2 className="font-display text-xl font-bold text-foreground">
              {quest.category}
            </h2>
            <div className="w-20" />
          </div>
        </div>

        {gameOver ? (
          /* Game Over Screen */
          <div className="text-center py-16 animate-fade-in">
            <h2 className="font-display text-3xl font-bold text-np-red mb-4">
              No Lives Left!
            </h2>
            <p className="text-muted-foreground mb-8">
              Your lives will reset tomorrow. You earned <strong>{score}</strong> points this session.
            </p>
            <button
              onClick={handleExit}
              className="np-button-primary"
            >
              Return to Quests
            </button>
          </div>
        ) : (
          /* Question Content */
          <div className="animate-fade-in">
            {/* Question */}
            <div className="mb-8">
              <p className="text-sm text-muted-foreground mb-2">
                Question {currentQuestionIndex + 1} of {quest.questions.length}
              </p>
              <h3 className="font-display text-2xl font-bold text-foreground">
                {currentQuestion.question}
              </h3>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {currentQuestion.options.map((option, index) => {
                let bgColor = 'bg-white text-np-navy';
                if (selectedAnswer !== null) {
                  if (index === currentQuestion.correctAnswer) {
                    bgColor = 'bg-success text-white';
                  } else if (index === selectedAnswer && !isCorrect) {
                    bgColor = 'bg-destructive text-white';
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                    className={`np-answer-option ${bgColor} ${
                      selectedAnswer === null ? 'hover:scale-105' : ''
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Result and Next */}
            {showResult && (
              <div className="text-center animate-slide-up">
                <p className={`text-xl font-bold mb-4 ${isCorrect ? 'text-success' : 'text-destructive'}`}>
                  {isCorrect ? '✓ Correct! +100 points' : '✗ Wrong answer!'}
                </p>
                <button
                  onClick={handleNext}
                  className="np-button-primary"
                >
                  {isLastQuestion ? 'Complete Quest' : 'Next Question'}
                </button>
              </div>
            )}

            {/* Score Display */}
            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                Current Score: <span className="text-primary font-bold">{score}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestPlay;
