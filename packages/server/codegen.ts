import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: './src/modules/**/*.graphql', 
    generates: {
        './src/types/index.d.ts': {
            plugins: [
                'typescript',
                'typescript-resolvers',
                'typescript-operations'
            ],
            config: {
                useIndexSignature: true,
            }
        }
    }
};

export default config;
