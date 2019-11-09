import { chunk, randomId, randomInt } from '@utilities';
import { ActivityFeedPost } from '../datatypes/activity-feed.datatypes';

const MIN_POST_AMOUNT = 50;
const MAX_POST_AMOUNT = 150;
const PAGE_SIZE = 10;
const MOCK_SERVER_FEED_POST_BLUEPRINT: Partial<ActivityFeedPost> = {};
const MOCK_HEADERS = [
  'Accessibility can be tricky',
  'Web Content Accessibility Guidelines version 2.1 is here',
  'Check out these accessibility tricks',
  'New version of Angular is now available'
];
const MOCK_TEXTS = [
  'That\'s right!',
  'See our website for more information.',
  'Who would\'ve thought?',
  'Amazing!'
];

const MOCK_SERVER_ACTIVITY_FEED_POSTS: ActivityFeedPost[] =
  new Array(randomInt(MIN_POST_AMOUNT, MAX_POST_AMOUNT))
  .fill(MOCK_SERVER_FEED_POST_BLUEPRINT)
  .map((post: ActivityFeedPost): ActivityFeedPost => ({
    ...post,
    id: randomId(),
    heading: MOCK_HEADERS[randomInt(0, MOCK_HEADERS.length)],
    content: MOCK_TEXTS[randomInt(0, MOCK_TEXTS.length)]
  }));

const CHUNKED_MOCK_SERVER_ACTIVITY_FEED_POSTS =
  chunk(MOCK_SERVER_ACTIVITY_FEED_POSTS, PAGE_SIZE);

export const getServerActivityFeedPostsPaginated = (
  page: number
): ActivityFeedPost[] => {
  if (page > CHUNKED_MOCK_SERVER_ACTIVITY_FEED_POSTS.length - 1) {
    return [];
  } else {
    return CHUNKED_MOCK_SERVER_ACTIVITY_FEED_POSTS[page];
  }
};
