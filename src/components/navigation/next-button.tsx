import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Button from '@mui/material/Button';
import { useAppSelector } from 'src/lib/hooks';
import { RootState } from 'src/lib/types';
import Link from 'next/link';

// Define the data types based on your data structure
interface QuestData {
  id: number;
  title: string;
}

interface AdventureData {
  id: number;
  title: string;
  quests: QuestData[];
}

interface StoryData {
  title: string;
  adventures: AdventureData[];
}

// Define the navigation item types
interface Quest {
  title: string;
  path: string;
}

interface Adventure {
  title: string;
  path: string;
  children: Quest[];
}

interface Story {
  subheader: string;
  items: Adventure[];
}

// Function to transform stories into navData
function getNavData(stories: StoryData[]): Story[] {
  return stories.map((story) => ({
    subheader: story.title,
    items: story.adventures.map((adventure, adventureIndex) => ({
      title: `${adventureIndex + 1}. ${adventure.title}`,
      path: `/dashboard/adventure/${adventure.id}`,
      children: [
        {
          title: '0. Overview',
          path: `/dashboard/adventure/${adventure.id}`,
        },
        ...adventure.quests.map((quest, questIndex) => ({
          title: `${questIndex + 1}. ${quest.title}`,
          path: `/dashboard/adventure/${adventure.id}/quests/${quest.id}`,
        })),
      ],
    })),
  }));
}

function normalizePath(path: string): string {
  return path.replace(/\/+$/, '');
}

export function NextButton() {
  const pathname = usePathname();
  const currentPath = pathname;

  const navDataState = useAppSelector((state: RootState) => state.navData);

  // Handle loading and error states
  if (navDataState.status === 'loading') {
    return <div>Loading...</div>;
  }

  if (navDataState.status === 'failed') {
    return <div>Error: {navDataState.error}</div>;
  }

  // Transform the stories into the navData structure
  const navData = useMemo(() => getNavData(navDataState.stories), [navDataState.stories]);

  // Compute the next path based on the current path
  const nextPath = useMemo(() => {
    let found = false;
    let nextPath: string | null = null;

    for (let storyIndex = 0; storyIndex < navData.length; storyIndex++) {
      const story: Story = navData[storyIndex];
      for (let adventureIndex = 0; adventureIndex < story.items.length; adventureIndex++) {
        const adventure: Adventure = story.items[adventureIndex];
        const quests = adventure.children;
        for (let questIndex = 0; questIndex < quests.length; questIndex++) {
          const quest: Quest = quests[questIndex];
          if (normalizePath(quest.path) === normalizePath(currentPath)) {
            // Found current page

            if (questIndex === 0) {
              // If on overview page, go to first quest
              if (quests.length > 1) {
                nextPath = quests[1].path;
              } else {
                // No quests, go to next adventure
                const nextAdventureIndex = adventureIndex + 1;
                if (nextAdventureIndex < story.items.length) {
                  nextPath = story.items[nextAdventureIndex].path;
                } else {
                  // Go to next story
                  const nextStoryIndex = storyIndex + 1;
                  if (nextStoryIndex < navData.length) {
                    const nextStory = navData[nextStoryIndex];
                    if (nextStory.items.length > 0) {
                      nextPath = nextStory.items[0].path;
                    }
                  }
                }
              }
            } else if (questIndex === quests.length - 1) {
              // Last quest in adventure
              const nextAdventureIndex = adventureIndex + 1;
              if (nextAdventureIndex < story.items.length) {
                nextPath = story.items[nextAdventureIndex].path;
              } else {
                // Last adventure in story
                const nextStoryIndex = storyIndex + 1;
                if (nextStoryIndex < navData.length) {
                  const nextStory = navData[nextStoryIndex];
                  if (nextStory.items.length > 0) {
                    nextPath = nextStory.items[0].path;
                  }
                }
              }
            } else {
              // Go to next quest in adventure
              nextPath = quests[questIndex + 1].path;
            }

            found = true;
            break;
          }
        }
        if (found) break;
      }
      if (found) break;
    }

    // Default to the first quest if no path is found
    if (!nextPath && navData.length > 0) {
      const firstStory = navData[0];
      if (firstStory.items.length > 0) {
        const firstAdventure = firstStory.items[0];
        if (firstAdventure.children.length > 1) {
          nextPath = firstAdventure.path;
        }
      }
    }

    return nextPath;
  }, [navData, currentPath]);

  if (!nextPath) {
    // No next page available
    return null;
  }

  return (
    <Button variant="contained" component={Link} href={nextPath}>
      Next
    </Button>
  );
}
