import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: 'src/schema/**/*.graphql', 
    generates: {
        './src/types/index.d.ts': {
            plugins: [
                'typescript',
                'typescript-resolvers'
            ],
            config: {
                useIndexSignature: true,
            }
        }
    }
};

export default config;
