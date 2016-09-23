export class VerticalGlobalFunctions{
    static formatNewsRoute(articleId: string): Array<any> {
        var articleRoute: Array<any>;
        if(articleId != null) {
            articleRoute = ['/news','story', articleId];

        } else{
            articleRoute = null;
        }
        return articleRoute ? articleRoute : ['Error-page'];
    }
}