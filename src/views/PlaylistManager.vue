<template lang="">
<layout-page>
    <v-snackbar v-model="deleted" :timeout="4000" color="error">
        Asset deleted successfully!
        <template v-slot:action="{ attrs }">
            <v-btn text white v-bind="attrs" @click="deleted = false">
                Close
            </v-btn>
        </template>
    </v-snackbar>
    <v-snackbar v-model="isUpdated" :timeout="4000" color="success">
        Playlist updated successfully!
        <template v-slot:action="{ attrs }">
            <v-btn text white v-bind="attrs" @click="isUpdated = false">
                Close
            </v-btn>
        </template>
    </v-snackbar>
    <v-dialog v-if="deleteDialog" v-model="deleteDialog" persistent max-width="490">
        <v-card>
            <v-alert border="top" colored-border type="error">
                Are you sure you want to delete this asset {{this.assetToDelete.name}}?<br>
                <small><b>This action is irreversible.</b></small>
            </v-alert>

            <v-card-actions class="justify-end">
                <v-btn color="blue darken-1" text @click="deleteAsset(assetToDelete)" :loading="isDeleting">Confirm</v-btn>
                <v-btn color="blue darken-1" text @click="deleteDialog = false">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <div>
        <v-row>
            <v-col cols="2">
                <v-card class="mx-auto">
                    <v-card-title>Select a playlist</v-card-title>
                    <v-card-text class="mt-2">
                        <div>
                            <div class="text-body-2">Playlist</div>
                            <v-select v-model="selectedPlaylist" outlined dense label="Playlist" :items="playlists" item-text="name" return-object @change="getPlaylistAssets"></v-select>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col>
                <v-card class="mx-auto">
                    <v-card-text>
                        <v-row>
                            <v-col class="pt-0">
                                <v-card elevation="0">
                                    <div>
                                        <v-card-title>
                                            <span>All assets</span>
                                            <div class="ml-auto mr-0">
                                                <v-btn color="primary" elevation="0" class="mx-1">
                                                    <v-icon>mdi-file-image</v-icon>
                                                </v-btn>
                                                <v-btn color="primary" elevation="0" class="mx-1">
                                                    <v-icon>mdi-video-box</v-icon>
                                                </v-btn>
                                                <v-btn color="primary" elevation="0" class="mx-1">
                                                    <v-icon>mdi-link</v-icon>
                                                </v-btn>
                                            </div>
                                        </v-card-title>
                                    </div>
                                    <div style="border: 0.5px solid black; background-color:#d3d3d3;max-height:600px;height:600px;overflow-y:auto;overflow-x:hidden" class="rounded px-12">
                                        <draggable class="list-group" :list="allAssets" group="assets" style="max-height:600px;height:600px;">
                                            <v-card class="mt-4 item rounded" v-for="(asset, index) in allAssets" :key="index">
                                                <v-card-text class="pa-0">
                                                    <v-row no-gutters>
                                                        <v-col cols="3">
                                                            <div style="height:100%">
                                                                <v-img height="150" v-if="asset.thumbnail" :src="'http://172.17.0.20:3000'+asset.thumbnail"></v-img>
                                                                <div v-else style="height:150px;background-color:grey" class="d-flex justify-center align-center">
                                                                    <v-icon dark>mdi-link</v-icon>
                                                                </div>
                                                            </div>
                                                        </v-col>
                                                        <v-col>
                                                            <div class="pt-3" style="height:100%">
                                                                <div>{{asset.name}}</div>
                                                            </div>
                                                        </v-col>
                                                        <v-col>
                                                            <div>
                                                                <div style="position: fixed; top: 1em; right: 1em;">
                                                                    <v-btn icon>
                                                                        <v-icon small color="#B71C1C" @click="showDeleteDialog(asset)">
                                                                            mdi-close
                                                                        </v-icon>
                                                                    </v-btn>
                                                                </div>
                                                            </div>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-text>

                                            </v-card>
                                        </draggable>
                                    </div>
                                </v-card>
                            </v-col>
                            <v-divider vertical></v-divider>
                            <v-col class="pt-0">
                                <v-card elevation="0">
                                    <v-card-title class="d-flex justify-space-between">
                                        <span>Selected assets</span>
                                        <v-btn color="primary" elevation="0" @click="updatePlaylist" :loading="isUpdating">
                                            <v-icon>mdi-floppy</v-icon>
                                        </v-btn>
                                    </v-card-title>
                                    <div style="border: 0.5px solid black; background-color:#d3d3d3;max-height:600px;height:600px;overflow-y:auto;overflow-x:hidden" class="rounded px-12">
                                        <draggable class="list-group" :list="selectedAssets" group="assets" style="height:580px;">
                                            <v-card class="mt-4 item rounded" v-for="(asset, index) in selectedAssets" :key="index">
                                                <v-card-text class="pa-0">
                                                    <v-row no-gutters>
                                                        <v-col cols="3">
                                                            <div style="height:100%">
                                                                <v-img height="150" v-if="asset.thumbnail" :src="'http://172.17.0.20:3000'+asset.thumbnail"></v-img>
                                                                <div v-else style="height:150px;background-color:grey" class="d-flex justify-center align-center">
                                                                    <v-icon dark>mdi-link</v-icon>
                                                                </div>
                                                            </div>
                                                        </v-col>
                                                        <v-col>
                                                            <div class="pt-3" style="height:100%">
                                                                <div>{{asset.name}}</div>
                                                                <div class="d-flex justify-center align-center" style="height:90%">
                                                                    <div class="mr-3">
                                                                        <v-checkbox label="Fullscreen" v-model="asset.fullscreen"></v-checkbox>
                                                                    </div>
                                                                    <div style="width:100px">
                                                                        <v-text-field v-model="asset.duration" type="number" outlined dense width="30px" label="Duration" hide-details></v-text-field>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-text>

                                            </v-card>
                                        </draggable>
                                    </div>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>

</layout-page>
</template>

<script>
import LayoutPage from '../layout/PlayerLayoutPage.vue';
import axios from 'axios';
import draggable from 'vuedraggable'

export default {
    components: {
        LayoutPage,
        draggable
    },
    data() {
        return {
            playlists: [],
            selectedPlaylist: null,
            allAssets: [],
            selectedAssets: [],
            assetToDelete: null,
            deleteDialog: false,
            isDeleting: false,
            deleted: false,
            isUpdated: false,
            isUpdating: false,
        }
    },

    methods: {
        getPlaylists() {
            axios.get('http://172.17.0.20:3000/api/playlists', {
                auth: {
                    username: "pi",
                    password: "pi"
                }
            }).then((resp) => {
                this.playlists = resp.data.data
                this.selectedPlaylist = this.playlists[0]
            }).then(() => {
                this.getPlaylistAssets()
            }).catch((err) => {
                console.log(err)
            })
        },
        getAllAssets() {
            axios.get('http://172.17.0.20:3000/api/files', {
                auth: {
                    username: "pi",
                    password: "pi"
                }
            }).then((resp) => {
                this.allAssets = resp.data.data.dbdata
            }).catch((err) => {
                console.log(err)
            })
        },
        getPlaylistAssets() {
            let assets = []
            for (let i in this.allAssets) {
                for (let j in this.selectedPlaylist.assets) {
                    if (this.selectedPlaylist.assets[j].filename == this.allAssets[i].name) {
                        let duration = this.selectedPlaylist.assets[j].duration
                        let fullscreen = this.selectedPlaylist.assets[j].fullscreen
                        let isVideo = this.selectedPlaylist.assets[j].isVideo
                        let fileAsset = {
                            ...this.allAssets[i]
                        }
                        fileAsset.duration = duration
                        fileAsset.fullscreen = fullscreen
                        fileAsset.isVideo = isVideo
                        assets.push(fileAsset)
                    }
                }
            }
            this.selectedAssets = assets
        },
        showDeleteDialog(asset) {
            this.deleteDialog = true
            this.assetToDelete = asset
        },
        deleteAsset(asset) {
            this.isDeleting = true
            axios.delete('http://172.17.0.20:3000/api/files/' + asset.name, {
                auth: {
                    username: "pi",
                    password: "pi"
                }
            }).then((resp) => {
                if (resp.status == 200) {
                    this.getAllAssets()
                    this.isDeleting = false
                    this.deleteDialog = false
                    this.deleted = true
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        async updatePlaylist() {
            this.isUpdating = true
            let playlistAssets = []
            this.selectedAssets.forEach(asset => {
                let a = {
                    duration: asset.duration,
                    filename: asset.name,
                    fullscreen: asset.fullscreen == undefined ? false : asset.fullscreen ? true : false,
                    isVideo: asset.isVideo == undefined ? this.isVideo(asset.name) : asset.isVideo,
                }
                playlistAssets.push(a)
            });
            this.selectedPlaylist.assets = playlistAssets
            const resp = await axios.post('http://172.17.0.20:3000/api/playlists/' + this.selectedPlaylist.name,
                this.selectedPlaylist, {
                    auth: {
                        username: "pi",
                        password: "pi"
                    }
                })
            if (resp.status == 200) {
                this.isUpdating = false
                this.isUpdated = true
            }
        },
        isVideo(filename) {
            let filenameArray = filename.split('.')
            let extension = filenameArray[filenameArray.length - 1]
            switch (extension) {
                case 'mp4':
                case 'mov':
                case 'm4v':
                case 'avi':
                case 'webm':
                case 'wmv':
                case 'flv':
                case 'mkv':
                case 'mpg':
                case 'mpeg':
                case '3gp':
                    return true;
            }
            return false

        }
    },

    mounted() {
        this.getAllAssets()
        this.getPlaylists()
    }
}
</script>

<style>
/* Cool hovering effect */
.item {
    cursor: pointer;
    transition: all 0.25s ease;
}

.item:hover {
    transform: scale(1.1, 1.1);
}

/* Cool hovering effect */
</style>
