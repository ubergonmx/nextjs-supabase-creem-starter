'use client';

import * as React from 'react';
import { summarizeText, type SummarizeResult } from '../actions/summarize';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  IconSparkles,
  IconCoins,
  IconAlertCircle,
  IconCircleCheck,
  IconLoader,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

const MAX_CHARS = 2000;

export function SummarizeForm({
  initialBalance,
  isUnlimited = false,
}: {
  initialBalance: number;
  isUnlimited?: boolean;
}) {
  const [text, setText] = React.useState('');
  const [result, setResult] = React.useState<SummarizeResult | null>(null);
  const [pending, startTransition] = React.useTransition();
  const [balance, setBalance] = React.useState(initialBalance);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    startTransition(async () => {
      const res = await summarizeText(text);
      setResult(res);
      if (res.success) {
        if (!isUnlimited) setBalance((b) => b - res.creditsUsed);
        setText('');
      }
    });
  }

  const charsUsed = text.length;
  const charsLeft = MAX_CHARS - charsUsed;
  const canSubmit = text.trim().length >= 10 && !pending;

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      {/* Input card */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Summarize Text</CardTitle>
            <CardDescription>
              Paste any article, doc, or notes and get a concise AI-generated summary.
            </CardDescription>
            <CardAction>
              <Badge variant="outline" className="gap-1.5 font-normal">
                <IconCoins className="size-3" />
                {isUnlimited ? '∞' : balance.toLocaleString()} credits
              </Badge>
            </CardAction>
          </CardHeader>

          <CardContent>
            <Textarea
              placeholder="Paste the text you want to summarize here…"
              className="min-h-36 resize-y"
              maxLength={MAX_CHARS}
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={pending}
            />
          </CardContent>

          <CardFooter className="flex items-center justify-between">
            <span
              className={cn(
                'text-xs tabular-nums',
                charsLeft < 100 ? 'text-destructive' : 'text-muted-foreground',
              )}
            >
              {charsUsed.toLocaleString()} / {MAX_CHARS.toLocaleString()}
            </span>
            <Button type="submit" size="sm" disabled={!canSubmit}>
              {pending ? (
                <>
                  <IconLoader className="animate-spin" />
                  Summarizing…
                </>
              ) : (
                <>
                  <IconSparkles />
                  Summarize
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* Result card */}
      {result && (
        <Card>
          <CardHeader>
            {result.success ? (
              <IconCircleCheck className="size-4 text-green-500" />
            ) : (
              <IconAlertCircle className="size-4 text-destructive" />
            )}
            <CardTitle className="text-base">{result.success ? 'Summary' : 'Error'}</CardTitle>
            {result.success && !result.isUnlimited && (
              <CardAction>
                <Badge variant="outline" className="font-normal text-muted-foreground">
                  −{result.creditsUsed} credit
                </Badge>
              </CardAction>
            )}
          </CardHeader>
          <CardContent>
            {result.success ? (
              <p className="text-sm leading-relaxed">{result.summary}</p>
            ) : (
              <p className="text-sm text-destructive">{result.error}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
