<template>
<v-app>
    <v-app-bar app flat color="white">
        <v-container class="py-0 fill-height">
            <v-avatar class="mr-10" color="grey darken-1" size="32"></v-avatar>

            <v-btn v-for="(route, index) in routes" :key="index" text>
                <router-link :to="route.link" class="routes">{{route.name}}</router-link>
            </v-btn>
        </v-container>
    </v-app-bar>

    <v-main class="grey lighten-3">
        <v-container>
            <slot></slot>
        </v-container>
    </v-main>
</v-app>
</template>

  
<script>
export default {
    name: 'LayoutPage',
    data: () => ({
        routes: [{
                link: '/',
                name: 'Players',
            },
            {
                link: '/playlist-manager',
                name: 'Playlist Manager',
            },
            {
                link: '/upload',
                name: 'Asset Manager',
            },

        ],
    }),
}
</script>
  
<style>
.routes {
    color: black !important;
    text-decoration: none;
}
/* Scrollbar like youtube */
*::-webkit-scrollbar {
    width: 16px;
}

*::-webkit-scrollbar-track {
    border-radius: 8px;
    background-color:white;
}

*::-webkit-scrollbar-thumb {
    height: 56px;
    border-radius: 8px;
    border: 4px solid transparent;
    background-clip: content-box;
    background-color: #888;
}

*::-webkit-scrollbar-thumb:hover {
    background-color: #555;
}
/* Scrollbar like youtube */
</style>
