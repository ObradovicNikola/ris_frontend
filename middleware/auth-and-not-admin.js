export default function ({ $auth, redirect, store }) {
  const user = $auth.user
  if (user && user.role !== 'ADMIN') {
    // let the user in
  } else {
    // store.dispatch('snackbar/setSnackbar', {
    //   color: 'error',
    //   text: 'You must be a student or an admin to view that page.',
    // })
    redirect('/')
  }
}
