"use client";
import React from "react";
import {
  FacebookShare,
  TwitterShare,
  TelegramShare,
  WhatsappShare,
} from "react-share-kit";

export const ShareButtons: React.FC<{ url: string; title: string }> = ({
  url,
  title,
}) => {
  return (
    <div className="flex flex-row justify-center gap-6">
      <TwitterShare
        url={url}
        title={title}
        via="LeJusteCoinBot"
        size={32}
        blankTarget
      />
      <FacebookShare url={url} quote={title} size={32} blankTarget />
      <TelegramShare url={url} title={title} size={32} blankTarget />
      <WhatsappShare url={url} title={title} size={32} blankTarget />
    </div>
  );
};
