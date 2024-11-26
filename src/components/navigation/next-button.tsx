import type { RootState } from 'src/lib/types';

import Link from 'next/link';
import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';

import Button from '@mui/material/Button';

import { useAppSelector } from 'src/lib/hooks';

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

  // Transform the stories into the navData structure
  const navData = useMemo(() => {
    if (navDataState.status === 'succeeded') {
      return getNavData(navDataState.stories);
    }
    return [];
  }, [navDataState]);

  // Compute the next path based on the current path
  const nextPath = useMemo(() => {
    let found = false;
    let computedNextPath: string | null = null;

    for (let storyIndex = 0; storyIndex < navData.length; storyIndex += 1) {
      const story: Story = navData[storyIndex];
      for (let adventureIndex = 0; adventureIndex < story.items.length; adventureIndex += 1) {
        const adventure: Adventure = story.items[adventureIndex];
        const quests = adventure.children;
        for (let questIndex = 0; questIndex < quests.length; questIndex += 1) {
          const quest: Quest = quests[questIndex];
          if (normalizePath(quest.path) === normalizePath(currentPath)) {
            // Found current page

            if (questIndex === 0) {
              // If on overview page, go to first quest
              if (quests.length > 1) {
                computedNextPath = quests[1].path;
              } else {
                // No quests, go to next adventure
                const nextAdventureIndex = adventureIndex + 1;
                if (nextAdventureIndex < story.items.length) {
                  computedNextPath = story.items[nextAdventureIndex].path;
                } else {
                  // Go to next story
                  const nextStoryIndex = storyIndex + 1;
                  if (nextStoryIndex < navData.length) {
                    const nextStory = navData[nextStoryIndex];
                    if (nextStory.items.length > 0) {
                      computedNextPath = nextStory.items[0].path;
                    }
                  }
                }
              }
            } else if (questIndex === quests.length - 1) {
              // Last quest in adventure
              const nextAdventureIndex = adventureIndex + 1;
              if (nextAdventureIndex < story.items.length) {
                computedNextPath = story.items[nextAdventureIndex].path;
              } else {
                // Last adventure in story
                const nextStoryIndex = storyIndex + 1;
                if (nextStoryIndex < navData.length) {
                  const nextStory = navData[nextStoryIndex];
                  if (nextStory.items.length > 0) {
                    computedNextPath = nextStory.items[0].path;
                  }
                }
              }
            } else {
              // Go to next quest in adventure
              computedNextPath = quests[questIndex + 1].path;
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
    if (!computedNextPath && navData.length > 0) {
      const firstStory = navData[0];
      if (firstStory.items.length > 0) {
        const firstAdventure = firstStory.items[0];
        if (firstAdventure.children.length > 1) {
          computedNextPath = firstAdventure.path;
        }
      }
    }

    return computedNextPath;
  }, [navData, currentPath]);

  // Handle loading and error states
  if (navDataState.status === 'loading') {
    return <div>Loading...</div>;
  }

  if (navDataState.status === 'failed') {
    return <div>Error: {navDataState.error}</div>;
  }

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
