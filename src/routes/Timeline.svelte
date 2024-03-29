<script lang="ts">
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { KeyManager } from 'onyx-ui/services';
  import { registerView } from 'onyx-ui/stores/view';
  import { onDestroy, onMount } from 'svelte';
  import { replace } from 'svelte-spa-router';
  import TweetLoader from '../components/TweetLoader.svelte';
  import { DataService } from '../services/data';
  import { Storage } from '../services/storage';

  export let params: { tweetId?: string };

  let getData;
  let tweetCount = 0;

  registerView({});

  const keyMan = KeyManager.subscribe({
    onArrowLeft: () => {
      getData.then((res) => {
        if (res.prevTweetId) {
          replace(`/timeline/${res.prevTweetId}`);
          tweetCount += 1;
        }
      });

      return true;
    },
    onArrowRight: () => {
      getData.then((res) => {
        if (res.nextTweetId) {
          replace(`/timeline/${res.nextTweetId}`);
          tweetCount -= 1;
        }
      });
      return true;
    },
  });

  async function getTweet(id: string) {
    const res = await new DataService().getTweetById(id);
    if (!res) throw new Error(`No tweet found for id ${id}`);
    return res;
  }

  onMount(async () => {
    const service = new DataService();
    await service.fetchNewTimelineTweets();

    const latestTimelineId = Storage.getItem<string>('last_read_id');

    if (!params.tweetId && latestTimelineId) {
      replace(`/timeline/${latestTimelineId}`);
      tweetCount = await service.getTweetCountSinceId(latestTimelineId);
    } else if (!params.tweetId) {
      const latestTweet = await service.getLatestTweet();
      replace(`/timeline/${latestTweet.id}`);
      tweetCount = await service.getTweetCountSinceId(latestTweet.id);
    } else {
      tweetCount = await service.getTweetCountSinceId(params.tweetId);
    }
  });

  onDestroy(() => keyMan.unsubscribe());

  $: if (params.tweetId) {
    getData = getTweet(params.tweetId);
    Storage.setItem('last_read_id', params.tweetId);
  }
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title={`Timeline ${tweetCount > 0 ? `(${tweetCount})` : ''}`} />
      <CardContent>
        <TweetLoader tweetId={params.tweetId} />
      </CardContent>
    </Card>
  </ViewContent>
</View>
