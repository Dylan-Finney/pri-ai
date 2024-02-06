import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  PinterestShareButton,
  VKShareButton,
  OKShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  RedditShareButton,
  EmailShareButton,
  TumblrShareButton,
  LivejournalShareButton,
  MailruShareButton,
  ViberShareButton,
  WorkplaceShareButton,
  LineShareButton,
  WeiboShareButton,
  PocketShareButton,
  InstapaperShareButton,
  HatenaShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  PinterestIcon,
  VKIcon,
  OKIcon,
  TelegramIcon,
  WhatsappIcon,
  RedditIcon,
  TumblrIcon,
  MailruIcon,
  EmailIcon,
  LivejournalIcon,
  ViberIcon,
  WorkplaceIcon,
  LineIcon,
  PocketIcon,
  InstapaperIcon,
  WeiboIcon,
  HatenaIcon,
} from "react-share";
const shareOptions = [
  {
    text: "Facebook",
    button: (url, statement) => (
      <FacebookShareButton url={url} quote={statement}>
        <FacebookIcon size={64} round />
      </FacebookShareButton>
    ),
  },
  {
    text: "Twitter",
    button: (url, statement) => (
      <TwitterShareButton url={url} title={statement}>
        <TwitterIcon size={64} round />
      </TwitterShareButton>
    ),
  },
  {
    text: "Telegram",
    button: (url, statement) => (
      <TelegramShareButton url={url} title={statement}>
        <TelegramIcon size={64} round />
      </TelegramShareButton>
    ),
  },
  {
    text: "Whatsapp",
    button: (url, statement) => (
      <WhatsappShareButton url={url} title={statement} separator=":: ">
        <WhatsappIcon size={64} round />
      </WhatsappShareButton>
    ),
  },
  {
    text: "Linkedin",
    button: (url, statement) => (
      <LinkedinShareButton url={url}>
        <LinkedinIcon size={64} round />
      </LinkedinShareButton>
    ),
  },
  {
    text: "Pinterest",
    button: (url, statement) => (
      <PinterestShareButton
        url={url}
        image={`personal-ai.prifina.com/assets/Illustration.svg`}
      >
        <PinterestIcon size={64} round />
      </PinterestShareButton>
    ),
  },
  {
    text: "VKShare",
    button: (url, statement) => (
      <VKShareButton
        url={url}
        image={`personal-ai.prifina.com/assets/Illustration.svg`}
      >
        <VKIcon size={64} round />
      </VKShareButton>
    ),
  },
  {
    text: "OK",
    button: (url, statement) => (
      <OKShareButton
        url={url}
        image={`personal-ai.prifina.com/assets/Illustration.svg`}
      >
        <OKIcon size={64} round />
      </OKShareButton>
    ),
  },
  {
    text: "Reddit",
    button: (url, statement) => (
      <RedditShareButton
        url={url}
        title={statement}
        windowWidth={660}
        windowHeight={460}
      >
        <RedditIcon size={64} round />
      </RedditShareButton>
    ),
  },
  {
    text: "Tumblr",
    button: (url, statement) => (
      <TumblrShareButton url={url} title={statement}>
        <TumblrIcon size={64} round />
      </TumblrShareButton>
    ),
  },
  {
    text: "Livejournal",
    button: (url, statement) => (
      <LivejournalShareButton
        url={url}
        title={"Introducing Pri-AI"}
        description={statement}
      >
        <LivejournalIcon size={64} round />
      </LivejournalShareButton>
    ),
  },
  {
    text: "Mailru",
    button: (url, statement) => (
      <MailruShareButton url={url} title={statement}>
        <MailruIcon size={64} round />
      </MailruShareButton>
    ),
  },
  {
    text: "Email",
    button: (url, statement) => (
      <EmailShareButton
        url={url}
        subject={"Introducing Pri-AI"}
        body={statement}
      >
        <EmailIcon size={64} round />
      </EmailShareButton>
    ),
  },
  {
    text: "Viber",
    button: (url, statement) => (
      <ViberShareButton url={url} title={statement}>
        <ViberIcon size={64} round />
      </ViberShareButton>
    ),
  },
  {
    text: "Workplace",
    button: (url, statement) => (
      <WorkplaceShareButton url={url} quote={statement}>
        <WorkplaceIcon size={64} round />
      </WorkplaceShareButton>
    ),
  },
  {
    text: "Line",
    button: (url, statement) => (
      <LineShareButton url={url} title={statement}>
        <LineIcon size={64} round />
      </LineShareButton>
    ),
  },
  {
    text: "Weibo",
    button: (url, statement) => (
      <WeiboShareButton
        url={url}
        title={statement}
        image={`personal-ai.prifina.com/assets/Illustration.svg`}
      >
        <WeiboIcon size={64} round />
      </WeiboShareButton>
    ),
  },
  {
    text: "Pocket",
    button: (url, statement) => (
      <PocketShareButton url={url} title={statement}>
        <PocketIcon size={64} round />
      </PocketShareButton>
    ),
  },
  {
    text: "Instapaper",
    button: (url, statement) => (
      <InstapaperShareButton url={url} title={statement}>
        <InstapaperIcon size={64} round />
      </InstapaperShareButton>
    ),
  },
  {
    text: "Hatena",
    button: (url, statement) => (
      <HatenaShareButton
        url={url}
        title={statement}
        windowWidth={660}
        windowHeight={460}
      >
        <HatenaIcon size={64} round />
      </HatenaShareButton>
    ),
  },
];

export default shareOptions;
