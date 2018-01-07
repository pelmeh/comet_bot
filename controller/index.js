const { users, status } = require('../model')
const { STAGE_INDEX } = require('../constants')
const phrases = require('../utils/phrases')
const sleep = require('../utils/sleep')

let stager = STAGE_INDEX.START

const isPositive = (body) => body.toLowerCase().match(/^(да)(|\W+)$/g)
const isNegative = (body) => body.toLowerCase().match(/^(нет)(|\W+)$/g)
const exeption = ({ reply }) => reply(phrases.exeption)

const chosenBy = (body) => {
  if (isPositive(body)) return 'positive'
  if (isNegative(body)) return 'negative'
  return null
}

const stages = {
  0: {
    hears: async ({ reply, user_id }) => {
      await status.set(user_id, STAGE_INDEX.INVATE)
      reply(phrases.welcome)
    },
  },
  1: {
    positive: async ({ reply, user_id }) => {
      await status.set(user_id, STAGE_INDEX.HEARS)
      reply(phrases.invate)
    },
    negative: async ({ reply, user_id }) => {
      await status.set(user_id, STAGE_INDEX.START)
      reply(phrases.sorry)
    },
    hears: async ({ reply }) => {
      reply(phrases.yesOrNo)
    }
  },
  2: {
    hears: async ({ reply, user_id, body }) => {
      await status.set(user_id, STAGE_INDEX.ACCEPTED)
      await users.add(user_id, body)
      reply(phrases.thank)
    },
  },
  3: {
    hears: async ({ reply }) => {
      reply(phrases.accept)
    },
  },
  10: {
    hears: async ({ reply }) => {
      reply(phrases.end)
    }
  },
  exeption: {
    hears: exeption,
  },
}

const getStatusBy = async (id) => {
  const user = await status.get(id)

  if (user) return user.status

  await status.add(id, stager)
  return stager
}

const router = async (msg) => {
  try {
    const pointer = await getStatusBy(msg.user_id)
    const actions = stages[pointer] || stages.exeption
    const replyBy = actions[chosenBy(msg.body)] || actions.hears

    replyBy(msg)
  } catch (e) {
    console.log(e)
    exeption(msg)
  }
}

const clear = async ({ reply, user_id }) => {
  await status.del(user_id)
  await users.del(user_id)
  reply(phrases.again)
}

const count = async function ({ reply }) {
  const list = await users.all('id')
  reply(list.length)
}

const stop = async function () {
  stager = STAGE_INDEX.STOPED 
}

const dispatch = async function ({ sendMessage }) {
  const list = await users.all()
  const last = list.length - 1

  try {
    await Promise.all(list.map(async ({ id }, index) => {
      const pointer = index === last ?  0 : index + 1 
      const congrats = list[pointer] // id, text

      sendMessage(id, congrats.text)
      await sleep(500)
    }))
  } catch (e) {
    console.log(e, 'err dispatch')
  }
}

module.exports = {
  router,
  clear,
  count,
  dispatch,
  stop,
}
