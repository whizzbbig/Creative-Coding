import * as prismic from '@prismicio/client'

import fetch from 'node-fetch'

export default class PrismicHook {
  async getData () {
    const {
      VITE_PRISMIC_REPOSITORY,
      VITE_PRISMIC_ACCESS_TOKEN
    } = process.env

    const accessToken = VITE_PRISMIC_ACCESS_TOKEN
    const endpoint = prismic.getEndpoint(VITE_PRISMIC_REPOSITORY)
    const client = prismic.createClient(endpoint, {
      accessToken,
      fetch
    })

    const about = await client.getSingle('about')
    const navigation = await client.getSingle('navigation')
    const meta = await client.getSingle('meta')
    const projectsData = await client.getAllByType('project')
    const productsList = await client.getSingle('projects')
    const projects = productsList.data.list.map(({ project: { id } }) => {
      return projectsData.find(p => p.id === id)
    })

    return {
      about,
      meta,
      navigation,
      projects
    }
  }
}
