import type { Tweet, User } from '../models';
import type { TwitterTweet, TwitterUser } from './twitter';

export function toTweet(source: TwitterTweet, users: TwitterUser[]): Tweet {
  const user = users.find((a) => a.id === source.author_id);

  const result: Tweet = {
    id: source.id,
    author: {
      id: user.id,
      name: user.name,
      username: user.username,
      avatarUrl: user.profile_image_url,
    },
    text: source.text,
    likeCount: source.public_metrics.like_count,
    quoteCount: source.public_metrics.quote_count,
    replyCount: source.public_metrics.reply_count,
    retweetCount: source.public_metrics.retweet_count,
    createdAt: source.created_at,
    entities: {},
  };

  if (source.entities?.hashtags) {
    result.entities.hashtags = source.entities.hashtags.map((a) => ({ tag: a.tag }));
  }

  if (source.entities?.urls) {
    result.entities.urls = source.entities.urls.map((a) => ({
      url: a.url,
      display_url: a.display_url,
    }));
  }

  return result;
}

export function toUser(source: TwitterUser): User {
  return {
    id: source.id,
    name: source.name,
    username: source.username,
    avatarUrl: source.profile_image_url.replace('_normal.jpg', '_200x200.jpg'),
    description: source.description,
    location: source.location,
    followersCount: source.public_metrics.followers_count,
    followingCount: source.public_metrics.following_count,
    tweetCount: source.public_metrics.tweet_count,
    listedCount: source.public_metrics.listed_count,
    createdAt: source.created_at,
  };
}
