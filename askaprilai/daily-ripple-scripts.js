// Daily Ripple Script Generator
// 5-minute inspirational content for retail/hospitality leaders

const dailyRippleTemplates = [
  {
    title: "Monday Momentum: Start Strong",
    intro: "Good morning, leaders! It's Monday, and that means it's time to set the tone for an incredible week. I'm April, and this is your Daily Ripple.",
    keyPoints: [
      "Your energy as a leader is contagious. If you start Monday with excitement and purpose, your team will feel it instantly.",
      "Take the first 30 minutes of your day to connect with your team members individually. Ask how their weekend was, and really listen.",
      "Set one clear, achievable goal for the week that everyone can rally around. Make it specific and celebrate when you hit it."
    ],
    actionStep: "Before 10 AM today, write down three things you're grateful for about your team and share one with each team member.",
    outro: "Remember, great leaders don't just manage Monday - they make Monday matter. You've got this. Until tomorrow, keep creating positive ripples."
  },
  
  {
    title: "Tuesday Truth: Difficult Conversations",
    intro: "Welcome back to your Daily Ripple. It's Tuesday, and today we're talking about something every leader faces but few master - difficult conversations.",
    keyPoints: [
      "The conversation you're avoiding is usually the one your business needs most. That performance issue, that attitude problem, that process that isn't working.",
      "Start with curiosity, not accusation. Instead of 'You're always late,' try 'I've noticed you've been arriving after your scheduled time. Help me understand what's happening.'",
      "Give them a chance to own the solution. Ask 'What do you think would help you succeed here?' People support what they help create."
    ],
    actionStep: "Identify one conversation you've been putting off and schedule it for this week. Remember: clarity is kindness.",
    outro: "Difficult conversations are like going to the gym - nobody loves them, but everyone benefits from them. Create that ripple of accountability today."
  },

  {
    title: "Wednesday Wisdom: Customer Connection",
    intro: "It's Wednesday, and you're halfway through the week! Time for your Daily Ripple dose of wisdom about what really drives customer loyalty.",
    keyPoints: [
      "Customers don't just buy products - they buy feelings. They want to feel seen, valued, and important. Your team creates those feelings.",
      "Train your staff to notice the details. The customer who seems stressed, the regular who tries something new, the first-time visitor who looks overwhelmed.",
      "Recovery is more powerful than perfection. How you handle mistakes creates stronger loyalty than getting everything right the first time."
    ],
    actionStep: "Today, challenge your team to create one 'wow' moment for a customer. Share the stories at your next team meeting.",
    outro: "Every customer interaction is a chance to create a positive ripple. Make today count. See you tomorrow."
  },

  {
    title: "Thursday Thinking: Team Development",
    intro: "Thursday greetings, leaders! Your Daily Ripple today is all about developing the people who make your business possible - your team.",
    keyPoints: [
      "Your job isn't just to manage people - it's to grow people. Ask yourself: Is each team member better today than they were last month?",
      "Delegate growth, not just tasks. Instead of just giving someone a job, give them a challenge that stretches their skills.",
      "Catch people doing things right. For every correction you make, find three things to praise. Recognition creates motivation."
    ],
    actionStep: "Pick one team member today and identify their next growth opportunity. Have that development conversation this week.",
    outro: "When you develop your people, they develop your business. Keep planting those seeds of growth. Tomorrow is Friday!"
  },

  {
    title: "Friday Focus: Week Reflection",
    intro: "Happy Friday, leaders! Time for your Daily Ripple reflection on the week that was and preparation for the week ahead.",
    keyPoints: [
      "Take 10 minutes to celebrate the wins, even the small ones. What went better this week than last week? Acknowledge the progress.",
      "Learn from the challenges without dwelling on them. Ask: What would I do differently? What systems need improvement?",
      "Plan one thing for next week that will make your team's job easier or more enjoyable. Great leaders are always thinking ahead."
    ],
    actionStep: "Before you leave today, thank three people specifically for something they did well this week. Be specific about the impact.",
    outro: "You made it through another week of leading. That's not small - that's significant. Enjoy your weekend, and I'll see you Monday for another Daily Ripple."
  }
];

// Content generation prompts for ChatGPT/Claude
const contentPrompts = [
  "Generate a 5-minute Daily Ripple script for retail leaders about handling difficult customers with empathy",
  "Create an inspirational Daily Ripple about building team culture in hospitality environments",
  "Write a Daily Ripple script about time management for busy retail managers",
  "Generate content about turning seasonal employees into year-round advocates",
  "Create a Daily Ripple about maintaining energy during busy holiday seasons"
];

// Export for use in automation system
module.exports = {
  dailyRippleTemplates,
  contentPrompts
};