import Bitfield from "./Bitfield";

class GuildConfigs extends Bitfield {
    static FLAGS = {
        MANDATORY_REASON: 1 << 0,
		LOG_UNBAN: 1 << 1,
		LOG_EVENTS: 1 << 2,
    }
}

console.log(new GuildConfigs(0).set(GuildConfigs.FLAGS.MANDATORY_REASON));

export default GuildConfigs;