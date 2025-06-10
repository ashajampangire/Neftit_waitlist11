import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Mail, X, Wallet, Twitter, ArrowLeft } from "lucide-react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import WaitlistCard from "@/components/WaitlistCard";
import EmailModal from "@/components/EmailModal";
import WalletVerificationDialog from "@/components/WalletVerificationDialog";
import TwitterVerificationDialog from "@/components/TwitterVerificationDialog";
import DiscordVerificationDialog from "@/components/DiscordVerificationDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useWaitlist } from "@/hooks/useWaitlist";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const referralCode = searchParams.get("ref");

  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showTwitterModal, setShowTwitterModal] = useState(false);
  const [showDiscordModal, setShowDiscordModal] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userWalletAddress, setUserWalletAddress] = useState<string | null>(null);
  const [userTwitterUsername, setUserTwitterUsername] = useState<string | null>(null);
  const [userDiscordUsername, setUserDiscordUsername] = useState<string | null>(null);
  const [waitlistCount, setWaitlistCount] = useState(1247);

  const { toast } = useToast();
  const { getTotalWaitlistCount } = useWaitlist();

  useEffect(() => {
    // Load waitlist count
    const loadWaitlistCount = async () => {
      const count = await getTotalWaitlistCount();
      setWaitlistCount(count);
    };
    loadWaitlistCount();
    
    // Check localStorage for completed actions
    const userData = localStorage.getItem("waitlist_user");
    if (userData) {
      const parsedData = JSON.parse(userData);
      
      // Set email if available
      if (parsedData.email) {
        setUserEmail(parsedData.email);
        if (!completedActions.includes("email")) {
          setCompletedActions(prev => [...prev, "email"]);
        }
      }
      
      // Set wallet address if available
      if (parsedData.wallet_address) {
        setUserWalletAddress(parsedData.wallet_address);
        if (!completedActions.includes("address")) {
          setCompletedActions(prev => [...prev, "address"]);
        }
      }
      
      // Set Twitter info if available
      if (parsedData.twitter_username && parsedData.twitter_followed) {
        setUserTwitterUsername(parsedData.twitter_username);
        if (!completedActions.includes("twitter")) {
          setCompletedActions(prev => [...prev, "twitter"]);
        }
      }
      
      // Set Discord info if available
      if (parsedData.discord_username && parsedData.discord_joined) {
        setUserDiscordUsername(parsedData.discord_username);
        if (!completedActions.includes("discord")) {
          setCompletedActions(prev => [...prev, "discord"]);
        }
      }
    }
  }, [getTotalWaitlistCount]);

  const handleActionComplete = (actionId: string) => {
    if (actionId === "email") {
      setShowEmailModal(true);
      return;
    }

    if (actionId === "address") {
      setShowWalletModal(true);
      return;
    }

    if (actionId === "twitter") {
      setShowTwitterModal(true);
      return;
    }

    if (actionId === "discord") {
      setShowDiscordModal(true);
      return;
    }
  };

  const handleEmailSuccess = (email: string, entry: any) => {
    setUserEmail(email);
    setCompletedActions([...completedActions, "email"]);
    
    // Get existing user data if available
    const existingData = localStorage.getItem("waitlist_user");
    const parsedExisting = existingData ? JSON.parse(existingData) : {};
    
    // Store user data in localStorage for dashboard with timestamp information
    localStorage.setItem(
      "waitlist_user",
      JSON.stringify({
        ...parsedExisting,
        email,
        referral_code: entry.referral_code,
        name: entry.name,
        wallet_address: userWalletAddress || parsedExisting.wallet_address || null,
        twitter_username: userTwitterUsername || parsedExisting.twitter_username || null,
        twitter_followed: completedActions.includes("twitter") || parsedExisting.twitter_followed || false,
        discord_username: userDiscordUsername || parsedExisting.discord_username || null,
        discord_joined: completedActions.includes("discord") || parsedExisting.discord_joined || false,
        created_at: entry.created_at || parsedExisting.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    );
  };

  const handleWalletSuccess = (walletAddress: string) => {
    setUserWalletAddress(walletAddress);
    setCompletedActions([...completedActions, "address"]);
    
    // Update localStorage with wallet address
    const userData = localStorage.getItem("waitlist_user");
    if (userData) {
      const parsedData = JSON.parse(userData);
      localStorage.setItem(
        "waitlist_user",
        JSON.stringify({
          ...parsedData,
          wallet_address: walletAddress,
          updated_at: new Date().toISOString(),
        })
      );
    }
  };
  
  const handleTwitterSuccess = (twitterUsername: string) => {
    setUserTwitterUsername(twitterUsername);
    setCompletedActions([...completedActions, "twitter"]);
    
    // Store twitter info in localStorage
    const userData = localStorage.getItem("waitlist_user");
    if (userData) {
      const parsedData = JSON.parse(userData);
      localStorage.setItem(
        "waitlist_user",
        JSON.stringify({
          ...parsedData,
          twitter_username: twitterUsername,
          twitter_followed: true,
          updated_at: new Date().toISOString(),
        })
      );
    }
  };
  
  const handleDiscordSuccess = (discordUsername: string) => {
    setUserDiscordUsername(discordUsername);
    setCompletedActions([...completedActions, "discord"]);
    
    // Store discord info in localStorage
    const userData = localStorage.getItem("waitlist_user");
    if (userData) {
      const parsedData = JSON.parse(userData);
      localStorage.setItem(
        "waitlist_user",
        JSON.stringify({
          ...parsedData,
          discord_username: discordUsername,
          discord_joined: true,
          updated_at: new Date().toISOString(),
        })
      );
    }
  };

  // Check if all required actions are completed (email, wallet, twitter, discord)
  const requiredActions = ["email", "address", "twitter", "discord"];
  const allActionsCompleted = requiredActions.every(action => 
    completedActions.includes(action)
  );

  return (
    <div className="min-h-screen flex flex-col bg-[url(assets/images/background1.jpg)] bg-cover bg-center bg-no-repeat text-white">
      <Header />
      <div className="flex-grow pt-0 px-4 pb-4">
        <div className="max-w-xl mx-auto space-y-6 py-10">
          {/* Header */}
          <div className="text-center mb-8">
          <h2
            className="text-5xl font-bold uppercase mb-2 bg-gradient-to-b from-[#b3a4f7] via-[#8f6fff] to-[#2d186c] bg-clip-text text-pretty  "
          >
            JOIN THE WAITLIST
          </h2>
            <p className="text-[#5D43EF EDEAFF]  text-3xl uppercase">
              FOR THE NEFTIT WEB3 EXPERIENCE
            </p>
          </div>

          {/* Action Cards */}
          <div className="space-y-5 px-1 text-[#5D43EF EDEAFF]">
            <WaitlistCard
              icon={<img src="/images/email.png" alt="Email Icon" className="w-full h-full object-contain rounded-lg"
                style={{ background: "transparent" }} />}
              title="Connect Email"
              subtitle="To Receive Latest Updates First"
              completed={completedActions.includes("email")}
              onClick={() => handleActionComplete("email")}
            />
            <WaitlistCard
              icon={<img src="/images/WALLET.png" alt="Wallet Icon" className="w-full h-full object-contain rounded-lg"
                style={{ background: "transparent" }} />}
              title="Enter Wallet Address"
              subtitle="To Receive Web3 Rewards"
              completed={completedActions.includes("address")}
              onClick={() => handleActionComplete("address")}
            />
            <WaitlistCard
              icon={<img src="/images/x.png" alt="X Icon" className="w-full h-full object-contain rounded-lg"
                style={{ background: "transparent" }} />}
              title="Follow Us On X"
              subtitle="To Stay Updated On Latest News"
              completed={completedActions.includes("twitter")}
              onClick={() => handleActionComplete("twitter")}
            />
            <WaitlistCard
              icon={<img src="/images/discord1.png" alt="Discord Icon" className="w-full h-full object-contain rounded-lg"
                style={{ background: "transparent" }} />}
              title="Join Our Discord"
              subtitle="Join & Become A Part Of our community"
              completed={completedActions.includes("discord")}
              onClick={() => handleActionComplete("discord")}
            />
          </div>

          {/* Enter Button */}
          <div className="mt-10">
          <Button
  className={`w-full py-6 px-6 rounded-xl font-bold text-2xl uppercase tracking-wide transition-all duration-300 ${
    allActionsCompleted
      ? "bg-[#5D43EF] text-white shadow-[0_0_20px_rgba(59,94,251,0.5)]"
      : "bg-gray-800/70 text-blue-200 cursor-not-allowed"
  }`}
  style={allActionsCompleted ? { } : {}}
  disabled={!allActionsCompleted}
  onClick={() => {
    if (allActionsCompleted) {
      navigate('/dashboard');
    }
  }}
>
  <span className="flex items-center justify-center">
    ENTER NEFTIT
    <svg className="ml-4 w-20 h-20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </span>
</Button>
          </div>


          {/* Email Modal */}
          <EmailModal
            isOpen={showEmailModal}
            onClose={() => setShowEmailModal(false)}
            onSuccess={handleEmailSuccess}
            referralCode={referralCode || undefined}
          />
          
          {/* Wallet Verification Modal */}
          <WalletVerificationDialog
            isOpen={showWalletModal}
            onClose={() => setShowWalletModal(false)}
            onSuccess={handleWalletSuccess}
          />
          
          {/* Twitter Verification Modal */}
          <TwitterVerificationDialog
            isOpen={showTwitterModal}
            onClose={() => setShowTwitterModal(false)}
            onSuccess={handleTwitterSuccess}
          />
          
          {/* Discord Verification Modal */}
          <DiscordVerificationDialog
            isOpen={showDiscordModal}
            onClose={() => setShowDiscordModal(false)}
            onSuccess={handleDiscordSuccess}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
