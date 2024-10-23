'use client';

import type { RootState } from 'src/lib/types';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';

import { useAppDispatch, useAppSelector } from 'src/lib/hooks';
import { fetchQuestDetail } from 'src/lib/features/quest/quest-slice';

import QuestChat from '../quest-chat';
import { QuestDescription } from '../quest-description';

export function QuestView() {
  const params = useParams();
  const questId = params?.questId;

  const dispatch = useAppDispatch();
  const { quest, status, error } = useAppSelector((state: RootState) => state.questDetail);

  useEffect(() => {
    if (questId) {
      dispatch(fetchQuestDetail(Number(questId)));
    }
  }, [questId, dispatch]);

  return (
    <>
      <QuestDescription status={status} error={error} quest={quest} />
      <QuestChat assistantId={quest?.assistant_id} />
    </>
  );
}
