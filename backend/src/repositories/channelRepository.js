import Channel from "../schema/channel.js";
import crudRepository from "./crudRepository.js";

const channelRepository = {
    ...crudRepository(Channel),

};

export default channelRepository;
