export const useLocalbase = (nuxtApp) => {
    const { $db } = nuxtApp

    const deleteDataCollection = (collection, id) => {
        $db.collection(collection)
          .doc({ id: id })
          .delete()
          .then(response => {
            console.log('Delete successful, now do something.')
          })
          .catch(error => {
            console.log(error)
          })
      }

    return {
        db: $db,
        deleteDataCollection
    }
}