'use client';

import { StoryPost } from "@/components/home/StoryPost";

const dummyPosts = [
  {
    author: 'Floyd Miles',
    handle: 'lilywhite',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Floyd',
    timestamp: '2 hours ago',
    title: 'The Dark Forest – Chapter 1',
    content: `The night was silent, and the wind whispered through the trees. Shadows danced around the ancient ruins, hiding secrets long forgotten. Jonathan stepped cautiously, the crunch of fallen leaves beneath his boots echoing in the empty forest. He felt a chill run down his spine as the moonlight flickered through the canopy. Somewhere in the distance, a branch snapped. He froze. Eyes darting around, he realized he was not alone. The forest had a rhythm, a heartbeat that seemed to follow him. Every step forward was a step deeper into mystery, and every shadow hid a story that dared not speak.`,
    likes: 27,
    comments: 657,
  },
  {
    author: 'Sarah Chen',
    handle: 'sarahwrites',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    timestamp: '4 hours ago',
    title: 'Lost in the City – A Short Story',
    content: `The rain poured down on the grey streets of downtown. Maya clutched her journal close to her chest, wondering if she had made the right decision to leave everything behind. The neon signs reflected off the wet pavement, creating a kaleidoscope of colors that danced before her eyes. She walked past strangers with their own stories, each one a thread in the grand tapestry of urban life. Was she lost, or was she finally finding her way? The city had a way of answering questions you didn't know you were asking.`,
    likes: 15,
    comments: 342,
  },
  {
    author: 'Marcus Rodriguez',
    handle: 'marcusauthor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    timestamp: '6 hours ago',
    title: 'The Last Light – Chapter 2',
    content: `As the sun began to set over the horizon, painting the sky in shades of amber and crimson, Elena understood what it meant to lose everything. The village below was silent now, the smoke from the fires finally clearing. She had done what needed to be done, but at what cost? Her hands trembled as she gripped the ancient artifact, feeling its power pulse through her veins. The prophecy was true. The old world was ending, and she was the bridge to what came next. There was no turning back now.`,
    likes: 42,
    comments: 891,
  },
  {
    author: 'Alex Thompson',
    handle: 'alexstories',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    timestamp: '8 hours ago',
    title: 'Whispers in the Wind',
    content: `The old mansion stood empty for decades, its halls filled with forgotten memories and dust-covered secrets. When I finally opened the door and stepped inside, I felt like I was stepping into another time. Every room told a story, every corner held a whisper of what once was. The grand staircase led to nowhere and everywhere at once. In the library, books remained untouched, their pages yellowed but their words still vibrant. I knew then that some places never truly die—they only wait for someone to remember them.`,
    likes: 19,
    comments: 524,
  },
];

export default function Home() {
  return (
    <div className="py-8">
      <div className="flex flex-col items-center justify-center gap-6  px-0 lg:px-4">
        {dummyPosts.map((post, index) => (
          <StoryPost
            key={index}
            author={post.author}
            handle={post.handle}
            avatar={post.avatar}
            timestamp={post.timestamp}
            title={post.title}
            content={post.content}
            likes={post.likes}
            comments={post.comments}
          />
        ))}
      </div>
    </div>
  );
}
