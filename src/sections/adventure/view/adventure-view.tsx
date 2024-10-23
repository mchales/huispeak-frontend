'use client';

import type { RootState } from 'src/lib/types';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';

import { useAppDispatch, useAppSelector } from 'src/lib/hooks';
import { fetchAdventureDetail } from 'src/lib/features/adventure/adventure-slice';

import { AdventureStoryDescription } from '../adventure-story-description';

export function AdventureView() {
  const params = useParams();
  const adventureId = params?.adventureId;

  const dispatch = useAppDispatch();
  const { adventure, status, error } = useAppSelector((state: RootState) => state.adventureDetail);

  useEffect(() => {
    if (adventureId) {
      dispatch(fetchAdventureDetail(Number(adventureId)));
    }
  }, [adventureId, dispatch]);

  return <AdventureStoryDescription status={status} error={error} adventure={adventure} />;
}
