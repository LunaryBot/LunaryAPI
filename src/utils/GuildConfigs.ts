import Bitfield from "./Bitfield";

class GuildConfigs extends Bitfield {
    static FLAGS = {
        MANDATORY_REASON: 1 << 0,
		LOG_UNBAN: 1 << 1,
		LOG_EVENTS: 1 << 2,
    }
}

export default GuildConfigs;