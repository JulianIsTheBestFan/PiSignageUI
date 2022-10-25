<template lang="">
<layout-page>
    <div>
        <v-row>
            <v-col cols="2">
                <v-card class="mx-auto">
                    <v-form @submit.prevent="uploadFile">
                        <v-card-title>Select the type to Upload</v-card-title>
                        <v-card-text class="mt-2">
                            <div>
                                <div class="text-body-2">Type</div>
                                <v-select v-model="fileType" :items="fileTypes"></v-select>
                            </div>
                            <div v-if="fileType == 'File'">
                                <v-file-input v-model="fileData" label="Upload a file..."></v-file-input>
                            </div>
                            <div v-else>
                                <div>
                                    <div class="text-body-2">Link</div>
                                    <v-select v-model="linkType" :items="linkTypes"></v-select>
                                </div>
                                <div>
                                    <div class="text-body-2">Link Name</div>
                                    <v-text-field v-model="linkName"></v-text-field>
                                </div>
                                <div>
                                    <div class="text-body-2">Link Address</div>
                                    <v-text-field v-model="linkAddress"></v-text-field>
                                </div>
                            </div>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn block type="submit" color="primary">Submit</v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card>
            </v-col>
            <v-col class="pt-0">
                <v-card class="mx-auto">
                    <v-card-text class="mt-3">
                        <v-row>
                            <v-col>
                                <v-card elevation="0">
                                    <v-card-title>
                                        Asset
                                    </v-card-title>
                                    <div>
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
import axios from 'axios';
import LayoutPage from '../layout/PlayerLayoutPage.vue';
export default {
    components: {
        LayoutPage
    },
    data() {
        return {
            fileType: 'File',
            fileTypes: ['File', 'Link'],
            linkType: 'Web Link',
            linkTypes: ['Web Link', 'Web Page', 'Youtube'],
            linkName: null,
            linkAddress: null,
            fileData: null,
        }
    },
    methods: {
        // Data Structures
        async uploadFile() {
            if (this.fileType === 'File') {
                try {
                    const formData = new FormData()
                    formData.append('assets', this.fileData)

                    const resp = await axios.post('http://172.17.0.20:3000/api/files', formData, {
                        auth: {
                            username: "pi",
                            password: "pi"
                        },
                        'Content-Type': `multipart/form-data`
                    })
                    const data = resp.data.data
                    const postUploadData = {
                        files: data,
                        categories: []
                    }
                    const resp2 = await axios.post('http://172.17.0.20:3000/api/postupload', postUploadData, {
                        auth: {
                            username: "pi",
                            password: "pi"
                        }
                    })
                    if (resp2.status == 200)
                        console.log('Post upload successful')
                } catch (error) {
                    console.log(error)
                }
            } else {
                try {
                    const data = {
                        details: {
                            name: this.linkName,
                            type: this.getLinkType(this.linkType),
                            link: this.linkAddress,
                        },
                        categories: []
                    }
                    const resp = await axios.post('http://172.17.0.20:3000/api/links', data, {
                        auth: {
                            username: "pi",
                            password: "pi"
                        }
                    })
                    if(resp.status == 200)
                        console.log('Link uploaded successfuly')
                } catch (error) {
                    console.log(error)
                }
            }
        },
        getLinkType(linkType){
            switch(linkType){
                case 'Web Link': return '.link';
                case 'Web Page': return '.weblink'
                case 'Youtube': return '.tv'
            }
        }
    }
}
</script>

<style lang="">

</style>
