<template>
    <div class="custom-container center-container">
        <h2>Register</h2>
        <form>
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">First name</label>
                <input type="text" class="form-control" aria-describedby="emailHelp">
                <div id="emailHelp" class="form-text">Ex: Juan.</div>
            </div>
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Last name</label>
                <input type="text" class="form-control" aria-describedby="emailHelp">
                <div id="emailHelp" class="form-text">Ex: Martinez.</div>
            </div>
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Email address</label>
                <input type="email" class="form-control" aria-describedby="emailHelp">
                <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">Password</label>
                <input type="password" class="form-control" id="exampleInputPassword1">
            </div>
            <button type="submit" class="btn btn-success">Register</button>
        </form>
    </div>
</template>

<style scoped>

</style>