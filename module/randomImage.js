module.exports ={
    randImage: () => {
        let defaultImage = [
            'https://flood-master.s3.ap-northeast-2.amazonaws.com/1.jpg',
            'https://flood-master.s3.ap-northeast-2.amazonaws.com/2.jpg',
            'https://flood-master.s3.ap-northeast-2.amazonaws.com/3.jpg',
            'https://flood-master.s3.ap-northeast-2.amazonaws.com/5.jpg',
            'https://flood-master.s3.ap-northeast-2.amazonaws.com/6.jpg',
            'https://flood-master.s3.ap-northeast-2.amazonaws.com/7.jpg',
            'https://flood-master.s3.ap-northeast-2.amazonaws.com/8.jpg',
            'https://flood-master.s3.ap-northeast-2.amazonaws.com/9.jpg',
            'https://flood-master.s3.ap-northeast-2.amazonaws.com/10.jpg',
            'https://flood-master.s3.ap-northeast-2.amazonaws.com/11.jpg'
        ]
        
        
        function randomItem(a) {
            return a[Math.floor(Math.random() * a.length)];
        }
        console.log(randomItem(defaultImage))
        return randomItem(defaultImage);
    }
}