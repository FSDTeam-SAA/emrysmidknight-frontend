'use client';

import { StoryPost } from "@/components/home/StoryPost";

const dummyPosts = [
  {
    author: 'Eleanor Pena',
    handle: 'oliverking',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eleanor',
    timestamp: '2 hours ago',
    title: "Dragon's Awakening – Chapter 5",
    content: `The mountains had always been quiet, their peaks covered with mist and ancient snow. But tonight the ground trembled beneath Mira's feet. A deep roar echoed through the valley as cracks of fire lit the sky. The villagers ran, but Mira stood still — she had been waiting for this moment her entire life.`,
    likes: 27,
    comments: 657,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  },
  {
    author: 'Floyd Miles',
    handle: 'lilywhite',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Floyd',
    timestamp: '4 hours ago',
    title: 'The Dark Forest – Chapter 1',
    content: `The night was silent, and the wind whispered through the trees. Shadows danced around the ancient ruins, hiding secrets long forgotten. Jonathan stepped cautiously, the crunch of fallen leaves beneath his boots echoing in the empty forest. He felt a chill run down his spine as the moonlight flickered through the canopy. Somewhere in the distance, a branch snapped. He froze.`,
    likes: 15,
    comments: 342,
    // no image/video — text only
  },
  {
    author: 'Sarah Chen',
    handle: 'sarahwrites',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    timestamp: '6 hours ago',
    title: 'Lost in the City – A Short Story',
    content: `The rain poured down on the grey streets of downtown. Maya clutched her journal close to her chest, wondering if she had made the right decision to leave everything behind.`,
    likes: 42,
    comments: 891,
    video: 'https://www.w3schools.com/html/mov_bbb.mp4', // example video
  },
  {
    author: 'Marcus Rodriguez',
    handle: 'marcusauthor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    timestamp: '8 hours ago',
    title: 'The Last Light – Chapter 2',
    content: `As the sun began to set over the horizon, painting the sky in shades of amber and crimson, Elena understood what it meant to lose everything. The village below was silent now, the smoke from the fires finally clearing.`,
    likes: 19,
    comments: 524,
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
  },
];

export default function Home() {
  return (
    <div className="py-8">
      <div className="flex flex-col items-center justify-center gap-6 px-0 lg:px-4">
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
            image={post.image}
            video={post.video}
          />
        ))}
      </div>
    </div>
  );
}