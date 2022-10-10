import axios from "axios";

const getIpAddress = async () => {
  try {
    const res = await axios.get("https://www.cloudflare.com/cdn-cgi/trace");
    const ip = await res.data
      .trim()
      .split("\n")
      .reduce(function (obj, pair) {
        pair = pair.split("=");
        // eslint-disable-next-line no-sequences
        return (obj[pair[0]] = pair[1]), obj;
      }, {});

    return ip;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default getIpAddress;

getIpAddress().then((res) => console.log(res));
